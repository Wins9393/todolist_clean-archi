export interface TodoData {
  id: string;
  title: string;
  done: boolean;
  isParent: boolean;
  parentId: string | null;
  created_at: string;
  updated_at: string;
}
