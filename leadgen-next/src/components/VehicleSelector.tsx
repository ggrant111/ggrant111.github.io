import { VehicleInfo } from '@/types/lead';
import { useEffect, useState } from 'react';

interface VehicleSelectorProps {
  value?: VehicleInfo;
  onChange: (vehicle: VehicleInfo | undefined) => void;
}

// Sample vehicle data (fallback)
const vehicles = [
  {
    year: '2025',
    make: 'Nissan',
    model: 'Rogue',
    vin: '5N1BT3AA7SC769391',
    stock: 'CNT250007',
    trim: 'S 4DR FRONT-WHEEL DRIVE',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1EJ1SN608517',
    stock: 'CNT250020',
    trim: 'PRO-X 4X2 CREW CAB',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Pathfinder',
    vin: '5N1DR3BA8SC200796',
    stock: 'CNT250116',
    trim: 'SV 4DR FRONT-WHEEL DRIVE',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Altima',
    vin: '1N4BL4CV8SN333542',
    stock: 'CNT250185',
    trim: 'SR (CVT) 4DR FWD Sedan',
    transmission: 'Automatic CVT'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1EJ4SN611010',
    stock: 'CNT250177',
    trim: 'PRO-X 4X2 CREW CAB',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Pathfinder',
    vin: '5N1DR3CBXSC205456',
    stock: 'CNT250478',
    trim: 'SL 4DR FRONT-WHEEL DRIVE',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1EK7SN625685',
    stock: 'CNT250501',
    trim: 'PRO-4X 4X4 CREW CAB',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Pathfinder',
    vin: '5N1DR3BD4SC223311',
    stock: 'CNT250497',
    trim: 'ROCK CREEK 4DR 4X4',
    transmission: 'Automatic'
  },
  {
    year: '2025',
    make: 'Nissan',
    model: 'Rogue',
    vin: '5N1BT3BB0SC804697',
    stock: 'CNT250410',
    trim: 'ROCK CREEK 4DR AWD',
    transmission: 'Automatic'
  }
];


export const VehicleSelector = ({ value, onChange }: VehicleSelectorProps) => {
  const [vehiclesList, setVehiclesList] = useState<VehicleInfo[]>(vehicles);

  useEffect(() => {
    let mounted = true;

    const loadVehicles = async () => {
      try {
        const res = await fetch('/vehicles.json');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setVehiclesList(data as VehicleInfo[]);
        }
      } catch (err) {
        // silently ignore and keep fallback
      }
    };

    loadVehicles();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (!selectedValue) {
      onChange(undefined);
      return;
    }
    
    try {
      const vehicle = JSON.parse(selectedValue) as VehicleInfo;
      onChange(vehicle);
    } catch (error) {
      console.error('Error parsing vehicle data:', error);
    }
  };
  
  // Convert the current value back to a string for the select
  const stringValue = value ? JSON.stringify(value) : '';
  
  // Improved styling for better contrast
  const selectClassName = "mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm py-2 px-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Vehicle</label>
      <select
        value={stringValue}
        onChange={handleChange}
        className={selectClassName}
      >
        <option value="">Please select a vehicle</option>
        {vehiclesList.map((vehicle) => (
          <option key={vehicle.vin ?? vehicle.stock ?? `${vehicle.make}-${vehicle.model}`} value={JSON.stringify(vehicle)}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </option>
        ))}
      </select>
    </div>
  );
}; 
