
-- Realtime publication
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Task -> notification
CREATE OR REPLACE FUNCTION public.notify_on_task_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor uuid := auth.uid();
BEGIN
  IF TG_OP = 'INSERT' AND NEW.assigned_to IS NOT NULL AND NEW.assigned_to <> COALESCE(actor,'00000000-0000-0000-0000-000000000000'::uuid) THEN
    INSERT INTO public.notifications (user_id, title, body, link, category)
    VALUES (NEW.assigned_to,
      'New task assigned: ' || NEW.title,
      COALESCE(NEW.description, 'Priority: ' || NEW.priority),
      '/board-portal/tasks', 'task');
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to AND NEW.assigned_to IS NOT NULL AND NEW.assigned_to <> COALESCE(actor,'00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notifications (user_id, title, body, link, category)
      VALUES (NEW.assigned_to, 'Task assigned to you: ' || NEW.title, NEW.description, '/board-portal/tasks', 'task');
    ELSIF (NEW.status IS DISTINCT FROM OLD.status OR NEW.due_at IS DISTINCT FROM OLD.due_at)
          AND NEW.assigned_to IS NOT NULL
          AND NEW.assigned_to <> COALESCE(actor,'00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notifications (user_id, title, body, link, category)
      VALUES (NEW.assigned_to,
        'Task updated: ' || NEW.title,
        'Status: ' || NEW.status || CASE WHEN NEW.due_at IS NOT NULL THEN ' · Due ' || to_char(NEW.due_at,'Mon DD') ELSE '' END,
        '/board-portal/tasks', 'task');
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_task_change ON public.tasks;
CREATE TRIGGER trg_notify_task_change
AFTER INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_on_task_change();

-- Message -> notification
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE sender_name text;
BEGIN
  IF NEW.recipient_id IS NULL OR NEW.recipient_id = NEW.sender_id THEN
    RETURN NEW;
  END IF;
  SELECT COALESCE(bm.full_name, p.full_name, 'A board member')
    INTO sender_name
    FROM public.board_members bm
    FULL JOIN public.profiles p ON p.id = NEW.sender_id
    WHERE bm.user_id = NEW.sender_id OR p.id = NEW.sender_id
    LIMIT 1;
  INSERT INTO public.notifications (user_id, title, body, link, category)
  VALUES (NEW.recipient_id,
    'New message from ' || COALESCE(sender_name,'a board member'),
    COALESCE(NEW.subject, left(NEW.body, 140)),
    '/board-portal/messages', 'message');
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_message ON public.messages;
CREATE TRIGGER trg_notify_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();

-- Announcement -> notification (fan out to all board members + admins/staff)
CREATE OR REPLACE FUNCTION public.notify_on_announcement()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, link, category)
  SELECT DISTINCT ur.user_id,
    'New announcement: ' || NEW.title,
    left(COALESCE(NEW.body,''), 200),
    '/board-portal', 'announcement'
  FROM public.user_roles ur
  WHERE ur.role IN ('board','staff','admin')
    AND ur.user_id <> COALESCE(NEW.created_by,'00000000-0000-0000-0000-000000000000'::uuid);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_announcement ON public.announcements;
CREATE TRIGGER trg_notify_announcement
AFTER INSERT ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.notify_on_announcement();
