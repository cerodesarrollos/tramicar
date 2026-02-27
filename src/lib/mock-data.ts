import { Operation, OperationStep } from './types'

export const MOCK_OPERATIONS: Operation[] = [
  {
    id: 'op-001',
    buyer_id: 'user-001',
    seller_id: 'user-002',
    seller_email: 'vendedor@email.com',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Corolla XEI',
    vehicle_year: 2020,
    vehicle_plate: 'AB 123 CD',
    vehicle_price: 18500000,
    current_step: 3,
    status: 'active',
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-24T15:30:00Z',
  },
  {
    id: 'op-002',
    buyer_id: 'user-001',
    seller_id: null,
    seller_email: 'carlos@email.com',
    vehicle_brand: 'Volkswagen',
    vehicle_model: 'Golf GTI',
    vehicle_year: 2022,
    vehicle_plate: 'AC 456 EF',
    vehicle_price: 25000000,
    current_step: 1,
    status: 'active',
    created_at: '2026-02-25T09:00:00Z',
    updated_at: '2026-02-25T09:00:00Z',
  },
]

export const MOCK_STEPS: Record<string, OperationStep[]> = {
  'op-001': [
    { id: 's1', operation_id: 'op-001', step_number: 1, status: 'completed', notes: 'Seña de $1.500.000 depositada', data: { amount: 1500000 }, completed_at: '2026-02-20T12:00:00Z', created_at: '2026-02-20T10:00:00Z' },
    { id: 's2', operation_id: 'op-001', step_number: 2, status: 'completed', notes: 'Sin inhibiciones ni embargos', data: null, completed_at: '2026-02-22T14:00:00Z', created_at: '2026-02-20T10:00:00Z' },
    { id: 's3', operation_id: 'op-001', step_number: 3, status: 'in_progress', notes: 'Verificando multas...', data: null, completed_at: null, created_at: '2026-02-20T10:00:00Z' },
    { id: 's4', operation_id: 'op-001', step_number: 4, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-20T10:00:00Z' },
    { id: 's5', operation_id: 'op-001', step_number: 5, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-20T10:00:00Z' },
    { id: 's6', operation_id: 'op-001', step_number: 6, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-20T10:00:00Z' },
  ],
  'op-002': [
    { id: 's7', operation_id: 'op-002', step_number: 1, status: 'in_progress', notes: 'Esperando depósito de seña', data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
    { id: 's8', operation_id: 'op-002', step_number: 2, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
    { id: 's9', operation_id: 'op-002', step_number: 3, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
    { id: 's10', operation_id: 'op-002', step_number: 4, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
    { id: 's11', operation_id: 'op-002', step_number: 5, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
    { id: 's12', operation_id: 'op-002', step_number: 6, status: 'pending', notes: null, data: null, completed_at: null, created_at: '2026-02-25T09:00:00Z' },
  ],
}
