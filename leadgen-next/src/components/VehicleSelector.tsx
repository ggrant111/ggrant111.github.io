import { VehicleInfo } from '@/types/lead';

interface VehicleSelectorProps {
  value?: VehicleInfo;
  onChange: (vehicle: VehicleInfo | undefined) => void;
}

// Sample vehicle data
const vehicles = [
  {
    year: '2026',
    make: 'Chevrolet',
    model: 'Silverado EV',
    vin: '1GC10ZED5TU402727',
    stock: '26402727',
    trim: 'LT W/3LT ALL-WHEEL DRIVE CREW CAB 5.75 FT. BOX 145.7 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Volkswagen',
    model: 'Tiguan',
    vin: '3VVGR7RM6TM000462',
    stock: '26000462',
    trim: '2.0T SE R-LINE BLACK 4DR ALL-WHEEL DRIVE 4MOTION',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1EKXTN620515',
    stock: 'CNT26515',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Ford',
    model: 'F-250',
    vin: '1FT8X2AA4TEC19178',
    stock: '2619178',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Mercedes-Benz',
    model: 'GLC 350E',
    vin: 'W1NKM5GBXTF438388',
    stock: '26438388',
    trim: 'GLC 350E 4DR ALL-WHEEL DRIVE 4MATIC',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Mercedes-Benz',
    model: 'GLE 350',
    vin: '4JGFB4FB7TB585300',
    stock: 'CNT265300',
    trim: 'GLE 350 4DR ALL-WHEEL DRIVE 4MATIC',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Honda',
    model: 'CR-V Hybrid',
    vin: '2HKRS6H96TH216000',
    stock: '266000',
    trim: 'SPORT TOURING (ECVT) 4DR ALL-WHEEL DRIVE',
    transmission: 'Automatic eCVT'
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1CL2TN610170',
    stock: '260170',
    trim: 'S 4X2 KING CAB 6 FT. BOX 126 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Armada',
    vin: 'JN8AY3EEXT9430691',
    stock: 'CNT26691',
    trim: 'PLATINUM (EOP 12-01-2025) 4DR 4X4',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Kicks',
    vin: '3N8AP6CE6TL349380',
    stock: 'CNT26380',
    trim: 'SV 4DR FRONT-WHEEL DRIVE',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Kicks',
    vin: '3N8AP6CB4TL307148',
    stock: '2607148',
    trim: 'SV 4DR ALL-WHEEL DRIVE',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1CM4TN622572',
    stock: 'CNT26572',
    trim: 'S 4X4 KING CAB 6 FT. BOX 126 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Honda',
    model: 'Civic Hybrid',
    vin: '2HGFE4F83TH004206',
    stock: '264026',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Honda',
    model: 'HR-V',
    vin: '3CZRZ2H72TM103670',
    stock: '263670',
    trim: 'EX-L (CVT) 4DR ALL-WHEEL DRIVE',
    transmission: 'Automatic CVT'
  },
  {
    year: '2026',
    make: 'Chevrolet',
    model: 'Silverado EV',
    vin: '1GC10ZED3TU402726',
    stock: '26402726',
    trim: 'LT W/3LT ALL-WHEEL DRIVE CREW CAB 5.75 FT. BOX 145.7 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Kicks',
    vin: '3N8AP6DB6TL336083',
    stock: 'CNT26083',
    trim: 'SR 4DR ALL-WHEEL DRIVE',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Honda',
    model: 'Civic Hybrid',
    vin: '2HGFE4F83TH004934',
    stock: '264934',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Armada',
    vin: 'JN8AY3EB1T9120046',
    stock: '2620046',
    trim: 'PLATINUM (EOP 12-01-2025) 4DR 4X4',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1CL4TN610171',
    stock: '260171',
    trim: 'S 4X2 KING CAB 6 FT. BOX 126 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Rogue',
    vin: 'JN8BT3DD9TW473674',
    stock: 'CNT26674',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1CL9TN610179',
    stock: '260179',
    trim: 'S 4X2 KING CAB 6 FT. BOX 126 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Ford',
    model: 'F-250',
    vin: '1FT8X2AA7TEC19174',
    stock: '2619174',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Murano',
    vin: '5N1AZ3DSXTC102122',
    stock: 'CNT26122',
    trim: 'PLATINUM 4DR ALL-WHEEL DRIVE',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Rogue',
    vin: 'JN8BT3BB3TW372437',
    stock: 'CNT26437',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Mercedes-Benz',
    model: 'GLC 350E',
    vin: 'W1NKM5GB0TF438383',
    stock: '26438383',
    trim: 'GLC 350E 4DR ALL-WHEEL DRIVE 4MATIC',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Sentra',
    vin: '3N1AB9CVXTY221855',
    stock: 'CNT26855',
    trim: 'SV 4DR SEDAN',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1EK2TN623098',
    stock: '2623098',
    trim: '',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Volkswagen',
    model: 'Tiguan',
    vin: '3VVGR7RM7TM000468',
    stock: '26000468',
    trim: '2.0T SE R-LINE BLACK 4DR ALL-WHEEL DRIVE 4MOTION',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Nissan',
    model: 'Frontier',
    vin: '1N6ED1CM0TN619927',
    stock: 'CNT26927',
    trim: 'S 4X4 KING CAB 6 FT. BOX 126 IN. WB',
    transmission: ''
  },
  {
    year: '2026',
    make: 'Mercedes-Benz',
    model: 'CLE 300',
    vin: 'W1KMJ4HB3TF094782',
    stock: 'CNT264782',
    trim: 'CLE 300 2DR ALL-WHEEL DRIVE 4MATIC COUPE',
    transmission: ''
  }
];


export const VehicleSelector = ({ value, onChange }: VehicleSelectorProps) => {
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
        {vehicles.map((vehicle, index) => (
          <option key={index} value={JSON.stringify(vehicle)}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </option>
        ))}
      </select>
    </div>
  );
}; 
