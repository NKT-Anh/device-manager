import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  subtitle 
}) => {
  const getColorValue = (color) => {
    const colors = {
      primary: '#1976d2',
      success: '#2e7d32',
      warning: '#ed6c02',
      error: '#d32f2f',
      info: '#0288d1'
    };
    return colors[color] || colors.primary;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#2e7d32' : '#d32f2f';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${getColorValue(color)}15 0%, ${getColorValue(color)}05 100%)`,
        border: `1px solid ${getColorValue(color)}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${getColorValue(color)}25`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: getColorValue(color),
                mb: 1
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                  label={`${trendValue}%`}
                  size="small"
                  sx={{
                    backgroundColor: getTrendColor(trend),
                    color: 'white',
                    fontSize: '0.75rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: '1rem'
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  so với tháng trước
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: `${getColorValue(color)}20`,
              color: getColorValue(color)
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
