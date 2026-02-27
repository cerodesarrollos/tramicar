export interface Operation {
  id: string
  buyer_id: string
  seller_id: string | null
  seller_email: string | null
  vehicle_brand: string
  vehicle_model: string
  vehicle_year: number
  vehicle_plate: string
  vehicle_price: number
  current_step: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface OperationStep {
  id: string
  operation_id: string
  step_number: number
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  notes: string | null
  data: Record<string, unknown> | null
  completed_at: string | null
  created_at: string
}

export interface Document {
  id: string
  operation_id: string
  step_number: number
  file_url: string
  file_name: string
  file_type: string
  uploaded_by: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
}
