const DEFAULT_PARAMETERS = [
  {
    name: 'pH',
    unit: 'pH units',
    recommendedLimit: '6.5 – 8.5',
    method: 'pH Meter',
    mandatoryLimit: 'Mandatory',
    description:
      'pH measures how acidic or basic your water is on a scale of 0 to 14. A pH of 7 is neutral. Water below 6.5 can corrode pipes and leach metals, while water above 8.5 may taste bitter and reduce the effectiveness of disinfection.',
    recommendedAction:
      'If your pH is outside the 6.5–8.5 range, a neutralizing filter or chemical feed system can bring it into balance. Contact a water treatment professional for guidance.',
  },
  {
    name: 'Chlorine',
    unit: 'mg/L',
    recommendedLimit: '≤ 4.0',
    method: 'DPD / Cl2 Ion Probes',
    mandatoryLimit: '',
    description:
      'Chlorine is commonly used to disinfect drinking water and kill harmful bacteria. While small amounts are safe and expected in treated water, excessive chlorine can cause an unpleasant taste and odor.',
    recommendedAction:
      'If chlorine levels are above 4.0 mg/L, an activated carbon filter can effectively reduce chlorine concentration. Levels below 0.2 mg/L may indicate insufficient disinfection.',
  },
  {
    name: 'Sulfates',
    unit: 'mg/L',
    recommendedLimit: '≤ 250',
    method: 'SulfaVer 4 Method 8051',
    mandatoryLimit: '',
    description:
      'Sulfates occur naturally in minerals and can enter water through soil and rock. High sulfate levels can give water a bitter taste and may have a laxative effect, especially for those not accustomed to it.',
    recommendedAction:
      'If sulfate levels exceed 250 mg/L, reverse osmosis or distillation systems can effectively reduce sulfate concentration.',
  },
  {
    name: 'Total Alkalinity',
    unit: 'mg/L',
    recommendedLimit: '80 – 400',
    method: 'STD Titration',
    mandatoryLimit: '',
    description:
      "Alkalinity is water's ability to neutralize acids, acting as a buffer against rapid pH changes. Adequate alkalinity helps protect pipes from corrosion and keeps water chemistry stable.",
    recommendedAction:
      'Low alkalinity (below 80 mg/L) may require a neutralizing filter to prevent pipe corrosion. Very high alkalinity can contribute to scale buildup and may need professional treatment.',
  },
  {
    name: 'Hardness',
    unit: 'mg/L',
    recommendedLimit: '5 – 180',
    method: 'STD Titration',
    mandatoryLimit: '',
    description:
      'Water hardness is caused primarily by calcium and magnesium dissolved in water. Hard water is not a health hazard but can cause scale buildup in pipes, water heaters, and appliances, and can reduce soap effectiveness.',
    recommendedAction:
      'If hardness exceeds 180 mg/L, a water softener can reduce mineral content. Consider the impact on appliance lifespan and soap usage when deciding on treatment.',
  },
  {
    name: 'Ammonia Nitrogen',
    unit: 'mg/L',
    recommendedLimit: '≤ 5.0',
    method: 'Nessler',
    mandatoryLimit: '',
    description:
      'Ammonia in water can indicate contamination from agricultural runoff, sewage, or naturally occurring organic matter decomposition. It can also interfere with chlorine disinfection.',
    recommendedAction:
      'If ammonia nitrogen exceeds 5.0 mg/L, investigate potential contamination sources. Treatment options include chlorination, biological filtration, or breakpoint chlorination.',
  },
  {
    name: 'Coliform Bacteria',
    unit: '/100 mL',
    recommendedLimit: '0 (Absent)',
    method: 'Colilert',
    mandatoryLimit: 'Mandatory',
    description:
      'Coliform bacteria are a group of organisms found in the environment and in the intestines of warm-blooded animals. Their presence in drinking water indicates potential contamination and the possible presence of disease-causing organisms.',
    recommendedAction:
      'Any detection of coliform bacteria requires immediate action. Disinfect the well or water system, retest, and if positive again, install continuous disinfection such as UV or chlorination. Do not drink the water until resolved.',
  },
  {
    name: 'E. Coli Bacteria',
    unit: '/100 mL',
    recommendedLimit: '0 (Absent)',
    method: 'Std Plate Count',
    mandatoryLimit: 'Mandatory',
    description:
      'E. coli is a specific type of coliform bacteria that comes exclusively from the feces of humans and warm-blooded animals. Its presence in water is a strong indicator of recent sewage or animal waste contamination and a serious health concern.',
    recommendedAction:
      'Any detection of E. coli is an urgent health risk. Stop using the water for drinking immediately. Disinfect the system, identify and eliminate the contamination source, and retest before resuming use.',
  },
  {
    name: 'Total Iron',
    unit: 'mg/L',
    recommendedLimit: '≤ 0.3',
    method: 'FerroVer Method 8008',
    mandatoryLimit: '',
    description:
      'Iron is a naturally occurring mineral that dissolves into groundwater from surrounding rock and soil. While not a health hazard at typical levels, excess iron causes rusty-colored staining on fixtures, laundry, and dishes, and gives water a metallic taste.',
    recommendedAction:
      'If iron exceeds 0.3 mg/L, treatment options include oxidation filtration, water softeners (for low levels), or specialized iron filters depending on the iron type (ferrous vs. ferric).',
  },
  {
    name: 'Manganese',
    unit: 'mg/L',
    recommendedLimit: '≤ 0.05',
    method: 'Periodate Oxidation Method 8149',
    mandatoryLimit: '',
    description:
      'Manganese is a naturally occurring mineral similar to iron. At elevated levels it causes brownish-black staining on fixtures and laundry, and can give water an unpleasant taste. Recent studies also suggest health concerns at higher concentrations.',
    recommendedAction:
      'If manganese exceeds 0.05 mg/L, oxidation filtration or specialized manganese filters can reduce levels. Treatment is similar to iron removal and the two are often addressed together.',
  },
  {
    name: 'Total Dissolved Solids',
    unit: 'mg/L',
    recommendedLimit: '≤ 500',
    method: 'Conductivity Method 8160',
    mandatoryLimit: '',
    description:
      'TDS is a measure of all dissolved minerals, salts, and metals in water. While not necessarily harmful, high TDS can affect taste, indicate mineral-rich water, and may signal the presence of other contaminants.',
    recommendedAction:
      'If TDS exceeds 500 mg/L, reverse osmosis is the most effective treatment. Distillation also works well. Identify the specific dissolved minerals to determine if any individual contaminants are of concern.',
  },
  {
    name: 'Turbidity Raw',
    unit: "NTU's",
    recommendedLimit: '≤ 1.0',
    method: 'Nephelometer',
    mandatoryLimit: 'Mandatory',
    description:
      'Turbidity measures the cloudiness of water caused by suspended particles such as silt, clay, algae, or organic matter. High turbidity can harbor bacteria and other pathogens, and interferes with disinfection processes.',
    recommendedAction:
      'If raw turbidity exceeds 1.0 NTU, sediment filtration or multimedia filtration can improve clarity. Persistent high turbidity may indicate a well or source water issue that needs professional assessment.',
  },
  {
    name: 'Turbidity Filtered @ 20',
    unit: "NTU's",
    recommendedLimit: '≤ 1.0',
    method: 'Nephelometer',
    mandatoryLimit: '',
    description:
      'This measurement shows turbidity after the water has been filtered through a 20-micron filter. It indicates how well a filtration system is performing and whether finer particles remain in the water.',
    recommendedAction:
      'If filtered turbidity exceeds 1.0 NTU, the filtration system may need maintenance, replacement, or an upgrade to finer filtration media.',
  },
  {
    name: 'Total PO4',
    unit: 'mg/L',
    recommendedLimit: '≤ 4.0',
    method: 'PhosVer III Method 8190',
    mandatoryLimit: '',
    description:
      'Phosphate occurs naturally but can also enter water from fertilizer runoff, sewage, or detergents. Elevated phosphate levels can indicate contamination from soaps or fertilizers and may signal surface water intrusion.',
    recommendedAction:
      'If phosphate exceeds 4.0 mg/L, investigate potential runoff or contamination sources. Reverse osmosis or specialized media filters can reduce phosphate levels if needed.',
  },
  {
    name: 'Total NO3',
    unit: 'mg/L',
    recommendedLimit: '≤ 10',
    method: 'Cadmium Reduction Method 8171',
    mandatoryLimit: 'Mandatory',
    description:
      'Nitrate is a regulated contaminant that commonly enters water through agricultural fertilizer runoff, septic systems, or natural deposits. High nitrate levels are a serious health concern, especially for infants, as it can interfere with oxygen transport in the blood.',
    recommendedAction:
      'If nitrate exceeds 10 mg/L, do not give the water to infants. Reverse osmosis, distillation, or ion exchange systems can remove nitrate. Identify and eliminate the contamination source.',
  },
  {
    name: 'Hydrogen Sulfide',
    unit: 'mg/L',
    recommendedLimit: 'Odor',
    method: 'Methylene Blue Method 8131',
    mandatoryLimit: '',
    description:
      'Hydrogen sulfide produces a distinctive "rotten egg" smell even at very low concentrations. It occurs naturally from sulfur-reducing bacteria in groundwater or from decaying organic matter. It can corrode plumbing and tarnish silverware.',
    recommendedAction:
      'If hydrogen sulfide is detected, aeration, activated carbon filtration, or oxidation systems (chlorination, ozone) can effectively remove it. Shock chlorination of the well may also help.',
  },
];

export default DEFAULT_PARAMETERS;
