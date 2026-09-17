import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const datosVentas = [
  { dia: 'Lun', ventas: 12000 },
  { dia: 'Mar', ventas: 19000 },
  { dia: 'Mié', ventas: 8000 },
  { dia: 'Jue', ventas: 15000 },
  { dia: 'Vie', ventas: 22000 },
  { dia: 'Sáb', ventas: 30000 },
  { dia: 'Dom', ventas: 25000 },
];

export default function DashboardVentas() {
  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>Reporte de Ventas - CalquitasCR</h2>
      <p style={{ color: '#888' }}>Resumen visual de ingresos semanales</p>
      
      <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
        <ResponsiveContainer>
          <BarChart data={datosVentas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="dia" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip formatter={(value) => `₡${value}`} />
            <Bar dataKey="ventas" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}