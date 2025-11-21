export interface DashboardTask {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  completed: boolean;
}

export interface DashboardTaskInsert {
  title: string;
  completed?: boolean;
}

export interface DashboardTaskUpdate {
  title?: string;
  completed?: boolean;
}



