export interface SystemHealthMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
  metadata?: Record<string, any>;
  recorded_at: string;
}

export interface SystemAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  metric_name?: string;
  threshold_value?: number;
  current_value?: number;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  created_at: string;
}

export interface EdgeFunctionMetric {
  id: string;
  function_name: string;
  execution_time_ms: number;
  status_code?: number;
  error_message?: string;
  request_size_bytes?: number;
  response_size_bytes?: number;
  memory_used_mb?: number;
  recorded_at: string;
}

export interface AlertThreshold {
  id: string;
  metric_name: string;
  warning_threshold?: number;
  critical_threshold?: number;
  comparison_operator: '>' | '<' | '>=' | '<=' | '=';
  is_enabled: boolean;
  notification_channels: string[];
}

export interface SystemHealthOverview {
  database: { status: string; connections: number; maxConnections: number; latency: number };
  edgeFunctions: { status: string; avgLatency: number; errorRate: number; totalCalls: number };
  storage: { status: string; usedBytes: number; totalBytes: number; usagePercent: number };
  memory: { status: string; usedMB: number; totalMB: number; usagePercent: number };
}

export interface PerformanceHistory {
  timestamp: string;
  latency: number;
  errorRate: number;
  requests: number;
}
