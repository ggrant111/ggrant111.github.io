import { VehicleInfo } from '@/types/lead';

interface VehicleSelectorProps {
  value?: VehicleInfo;
  onChange: (vehicle: VehicleInfo | undefined) => void;
}

// Sample vehicle data
const vehicles = [
  {
    "Stock#": 26402727,
    "Year": 2026,
    "Make": "CHEVROLET",
    "Model": "SILVERADO EV",
    "Trim": "LT W/3LT ALL-WHEEL DRIVE CREW CAB 5.75 FT. BOX 145.7 IN. WB",
    "N/U/T": "N",
    "Vin": "1GC10ZED5TU402727"
  },
  {
    "Stock#": 26000462,
    "Year": 2026,
    "Make": "VOLKSWAGEN",
    "Model": "TIGUAN",
    "Trim": "2.0T SE R-LINE BLACK 4DR ALL-WHEEL DRIVE 4MOTION",
    "N/U/T": "N",
    "Vin": "3VVGR7RM6TM000462"
  },
  {
    "Stock#": "CNT26515",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "1N6ED1EKXTN620515"
  },
  {
    "Stock#": 2619178,
    "Year": 2026,
    "Make": "FORD",
    "Model": "F-250",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "1FT8X2AA4TEC19178"
  },
  {
    "Stock#": 26438388,
    "Year": 2026,
    "Make": "MERCEDES-BENZ",
    "Model": "GLC 350E",
    "Trim": "GLC 350E 4DR ALL-WHEEL DRIVE 4MATIC",
    "N/U/T": "N",
    "Vin": "W1NKM5GBXTF438388"
  },
  {
    "Stock#": "CNT265300",
    "Year": 2026,
    "Make": "MERCEDES-BENZ",
    "Model": "GLE 350",
    "Trim": "GLE 350 4DR ALL-WHEEL DRIVE 4MATIC",
    "N/U/T": "N",
    "Vin": "4JGFB4FB7TB585300"
  },
  {
    "Stock#": 266000,
    "Year": 2026,
    "Make": "HONDA",
    "Model": "CR-V HYBRID",
    "Trim": "SPORT TOURING (ECVT) 4DR ALL-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "2HKRS6H96TH216000"
  },
  {
    "Stock#": 260170,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "S 4X2 KING CAB 6 FT. BOX 126 IN. WB",
    "N/U/T": "N",
    "Vin": "1N6ED1CL2TN610170"
  },
  {
    "Stock#": "CNT26691",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "ARMADA",
    "Trim": "PLATINUM (EOP 12-01-2025) 4DR 4X4",
    "N/U/T": "N",
    "Vin": "JN8AY3EEXT9430691"
  },
  {
    "Stock#": "CNT26380",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "KICKS",
    "Trim": "SV 4DR FRONT-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "3N8AP6CE6TL349380"
  },
  {
    "Stock#": 2607148,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "KICKS",
    "Trim": "SV 4DR ALL-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "3N8AP6CB4TL307148"
  },
  {
    "Stock#": "CNT26572",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "S 4X4 KING CAB 6 FT. BOX 126 IN. WB",
    "N/U/T": "N",
    "Vin": "1N6ED1CM4TN622572"
  },
  {
    "Stock#": 264026,
    "Year": 2026,
    "Make": "HONDA",
    "Model": "CIVIC HYBRID",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "2HGFE4F83TH004206"
  },
  {
    "Stock#": 263670,
    "Year": 2026,
    "Make": "HONDA",
    "Model": "HR-V",
    "Trim": "EX-L (CVT) 4DR ALL-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "3CZRZ2H72TM103670"
  },
  {
    "Stock#": 26402726,
    "Year": 2026,
    "Make": "CHEVROLET",
    "Model": "SILVERADO EV",
    "Trim": "LT W/3LT ALL-WHEEL DRIVE CREW CAB 5.75 FT. BOX 145.7 IN. WB",
    "N/U/T": "N",
    "Vin": "1GC10ZED3TU402726"
  },
  {
    "Stock#": "CNT26083",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "KICKS",
    "Trim": "SR 4DR ALL-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "3N8AP6DB6TL336083"
  },
  {
    "Stock#": 264934,
    "Year": 2026,
    "Make": "HONDA",
    "Model": "CIVIC HYBRID",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "2HGFE4F83TH004934"
  },
  {
    "Stock#": 2620046,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "ARMADA",
    "Trim": "PLATINUM (EOP 12-01-2025) 4DR 4X4",
    "N/U/T": "N",
    "Vin": "JN8AY3EB1T9120046"
  },
  {
    "Stock#": 260171,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "S 4X2 KING CAB 6 FT. BOX 126 IN. WB",
    "N/U/T": "N",
    "Vin": "1N6ED1CL4TN610171"
  },
  {
    "Stock#": "CNT26674",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "ROGUE",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "JN8BT3DD9TW473674"
  },
  {
    "Stock#": 260179,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "S 4X2 KING CAB 6 FT. BOX 126 IN. WB",
    "N/U/T": "N",
    "Vin": "1N6ED1CL9TN610179"
  },
  {
    "Stock#": 2619174,
    "Year": 2026,
    "Make": "FORD",
    "Model": "F-250",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "1FT8X2AA7TEC19174"
  },
  {
    "Stock#": "CNT26122",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "MURANO",
    "Trim": "PLATINUM 4DR ALL-WHEEL DRIVE",
    "N/U/T": "N",
    "Vin": "5N1AZ3DSXTC102122"
  },
  {
    "Stock#": "CNT26437",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "ROGUE",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "JN8BT3BB3TW372437"
  },
  {
    "Stock#": 26438383,
    "Year": 2026,
    "Make": "MERCEDES-BENZ",
    "Model": "GLC 350E",
    "Trim": "GLC 350E 4DR ALL-WHEEL DRIVE 4MATIC",
    "N/U/T": "N",
    "Vin": "W1NKM5GB0TF438383"
  },
  {
    "Stock#": "CNT26855",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "SENTRA",
    "Trim": "SV 4DR SEDAN",
    "N/U/T": "N",
    "Vin": "3N1AB9CVXTY221855"
  },
  {
    "Stock#": 2623098,
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "",
    "N/U/T": "N",
    "Vin": "1N6ED1EK2TN623098"
  },
  {
    "Stock#": 26000468,
    "Year": 2026,
    "Make": "VOLKSWAGEN",
    "Model": "TIGUAN",
    "Trim": "2.0T SE R-LINE BLACK 4DR ALL-WHEEL DRIVE 4MOTION",
    "N/U/T": "N",
    "Vin": "3VVGR7RM7TM000468"
  },
  {
    "Stock#": "CNT26927",
    "Year": 2026,
    "Make": "NISSAN",
    "Model": "FRONTIER",
    "Trim": "S 4X4 KING CAB 6 FT. BOX 126 IN. WB",
    "N/U/T": "N",
    "Vin": "1N6ED1CM0TN619927"
  },
  {
    "Stock#": "CNT264782",
    "Year": 2026,
    "Make": "MERCEDES-BENZ",
    "Model": "CLE 300",
    "Trim": "CLE 300 2DR ALL-WHEEL DRIVE 4MATIC COUPE",
    "N/U/T": "N",
    "Vin": "W1KMJ4HB3TF094782"
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
