import React, { useMemo, useState } from 'react';
import { Box, Paper, Toolbar, Typography, Button, IconButton, Tooltip, Chip, TextField, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Inventory2 as InventoryIcon, Warning } from '@mui/icons-material';
import EquipmentForm from './EquipmentForm';
import useInventory from '../../hooks/useInventory';
import { removeEquipment } from '../../services/manager/inventoryApi';
import { STATUS_LABELS } from '../../utils/statusLabel';

export default function InventoryPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { rows, loading, summary, lowStockTypes } = useInventory();
  const tableSource = useMemo(() => {
    if (statusFilter === 'all') return rows;
    return rows.filter(r => r.status === statusFilter);
  }, [rows, statusFilter]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keyword, setKeyword] = useState('');
  

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return tableSource;
    return tableSource.filter(r =>
      r.name?.toLowerCase().includes(kw) ||
      r.type?.toLowerCase().includes(kw) ||
      r.description?.toLowerCase().includes(kw)
    );
  }, [tableSource, keyword]);

  // màu cho trạng thái (đã đổi theo yêu cầu)
  const statusColor = {
    available: 'default',    // xám
    assigned: 'info',        // xanh dương
    maintenance: 'success',  // xanh lá
  };

  // ======= BIỂU ĐỒ TRÒN (donut) TỔNG KẾT =======
  const COLORS = {
    available: '#2e7d32',   // green 800
    assigned: '#0288d1',    // lightBlue 700
    maintenance: '#ed6c02', // orange 700
    track: '#eceff1',       // grey 100 cho nền
  };

  // Vẽ 1 donut bằng conic-gradient (không cần lib)
  const Donut = ({ a, s, m, size = 54 }) => {
    const total = Math.max(a + s + m, 1);
    const sDeg = (s / total) * 360;
    const mDeg = (m / total) * 360;
    const bg = `conic-gradient(${COLORS.maintenance} 0 ${mDeg}deg, ${COLORS.assigned} ${mDeg}deg ${mDeg + sDeg}deg, ${COLORS.available} ${mDeg + sDeg}deg 360deg)`;
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: bg,
          position: 'relative',
          flex: '0 0 auto',
        }}
      >
        {/* lỗ donut */}
        <Box
          sx={{
            position: 'absolute',
            inset: 5,
            borderRadius: '50%',
            backgroundColor: 'background.paper',
          }}
        />
      </Box>
    );
  };

  // Legend removed as it's not used
  

  // Thanh tổng kết sticky + cuộn ngang: mỗi loại 1 donut
  // Thanh tổng kết sticky + cuộn ngang: mỗi loại 1 donut
const SummaryBar = ({ data }) => (
    <Paper
      elevation={1}
      sx={{
        position: 'sticky',
        top: 64 + 8,                 // AppBar (64) + đệm nhỏ để không dính
        zIndex: (t) => t.zIndex.appBar - 1,
        p: 2,
        mb: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        bgcolor: 'background.paper', // đồng bộ với Paper bên dưới
      }}
    >
      {/* Legend bên trái */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 auto' }}>
        {[
          { c: COLORS.available, t: STATUS_LABELS.available },
          { c: COLORS.assigned, t: STATUS_LABELS.assigned },
          { c: COLORS.maintenance, t: STATUS_LABELS.maintenance },
        ].map((it) => (
          <Box key={it.t} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: it.c }} />
            <Typography variant="body2">{it.t}</Typography>
          </Box>
        ))}
      </Box>
  
      {/* Các donut bên phải */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Object.entries(data).map(([type, v]) => {
          const a = v?.available || 0;
          const s = v?.assigned || 0;
          const m = v?.maintenance || 0;
          const total = (v?.total || a + s + m) || 0;
  
          return (
            <Box
              key={type}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                bgcolor: 'grey.50',
                flex: '0 0 auto',
              }}
            >
              <Donut a={a} s={s} m={m} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{type}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {a}/{total} có sẵn • {s} đang dùng • {m} bảo trì
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
  
  

  // ======= CỘT BẢNG =======
  const columns = [
    { field: 'name', headerName: 'Thiết bị', flex: 1, minWidth: 160 },
    {
      field: 'type', headerName: 'Loại', width: 140,
      sortable: true,
      renderCell: (p) => (
        <Chip
          label={p.value || 'Khác'}
          size="small"
          color={lowStockTypes.includes(p.value) ? 'warning' : 'default'}
          icon={lowStockTypes.includes(p.value) ? <Warning /> : undefined}
        />
      )
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 150,
      renderCell: (p) => (
        <Chip
          size="small"
          label={STATUS_LABELS[p.value] || p.value}
          color={statusColor[p.value] || 'default'}
        />
      )
    },
    {
      field: 'specs',
      headerName: 'Thông số',
      flex: 1.3,
      minWidth: 150,
      sortable: false,
      renderCell: (p) => {
        let specs = {};
        const raw = p.value;
        if (raw && typeof raw === 'object') specs = raw;
        else if (typeof raw === 'string') {
          try { specs = JSON.parse(raw); }
          catch {
            raw.split(/\r?\n/).forEach((line) => {
              const m = line.match(/^([^:]+)\s*:\s*(.+)$/);
              if (m) specs[m[1].trim()] = m[2].trim();
            });
          }
        }
        const entries = Object.entries(specs);
        if (!entries.length) return <span>-</span>;

        const labelMap = { RAM: 'RAM', PSU: 'Nguồn', CPU: 'CPU', VGA: 'VGA', MAIN: 'Mainboard' };

        return (
          <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.35 }}>
            {entries.map(([k, v]) => (
              <div key={k}><strong>{labelMap[k] || k}:</strong> {String(v)}</div>
            ))}
          </Box>
        );
      }
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (p) => (
        <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.35 }}>
          {p.value ? String(p.value) : '-'}
        </Box>
      )
    },
    { field: 'currentUser', headerName: 'Người dùng hiện tại', width: 200 },
    { field: 'currentFacilityId', headerName: 'Cơ sở hiện tại', width: 160 },
    {
      field: 'actions', headerName: 'Thao tác', width: 140, sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Sửa">
            <IconButton onClick={() => { setEditing(params.row); setOpenForm(true); }}><EditIcon/></IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton color="error" onClick={() => removeEquipment(params.row.id)}><DeleteIcon/></IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  return (
    <>
      {/* Biểu đồ tròn tổng kết – sticky ngay dưới AppBar, cuộn ngang khi nhiều loại */}
      

      <Box sx={{ p: 2 }}>
      <SummaryBar data={summary} />
        <Paper sx={{ p: 2 }}>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <InventoryIcon />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>Quản lý Kho</Typography>

            <TextField
              select size="small" label="Trạng thái"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="available">{STATUS_LABELS['available']}</MenuItem>
              <MenuItem value="assigned">{STATUS_LABELS['assigned']}</MenuItem>
              <MenuItem value="maintenance">{STATUS_LABELS['maintenance']}</MenuItem>
            </TextField>

            <TextField
              size="small" placeholder="Tìm theo tên/loại/mô tả…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{ minWidth: 260 }}
            />

            <Button startIcon={<AddIcon />} variant="contained"
              onClick={() => { setEditing(null); setOpenForm(true); }}>
              Thêm thiết bị
            </Button>
          </Toolbar>

          <Box>
            <DataGrid
              rows={filtered}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              autoHeight
              density="compact"
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: 'type', sort: 'asc' }] },
              }}
              pageSizeOptions={[10, 20, 50]}
              getRowHeight={() => 96}
            />
          </Box>
        </Paper>

        <EquipmentForm open={openForm} onClose={() => setOpenForm(false)} editing={editing}/>
      </Box>
    </>
  );
}
