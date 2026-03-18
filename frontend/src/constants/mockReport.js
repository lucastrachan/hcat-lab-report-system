import DEFAULT_PARAMETERS from './defaultParameters';

const MOCK_REPORT = {
  reportId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  status: 'SENT',
  customerName: 'Jane Doe',
  customerEmail: 'jane.doe@example.com',
  customerPhone: '(555) 123-4567',
  customerAddress: '123 Mountain Rd, Breckenridge, CO 80424',
  sampleDate: '2026-03-15',
  createdAt: '2026-03-15T14:30:00.000Z',
  updatedAt: '2026-03-15T14:30:00.000Z',
  notes: 'Slight sulfur smell noted at collection point. Customer reported intermittent discoloration in the mornings.',
  samples: [
    {
      sampleId: 's1',
      label: 'Kitchen Tap',
      parameters: DEFAULT_PARAMETERS.map((p) => ({
        ...p,
        value: getExampleValue(p.name, 0),
      })),
    },
    {
      sampleId: 's2',
      label: 'Well Head',
      parameters: DEFAULT_PARAMETERS.map((p) => ({
        ...p,
        value: getExampleValue(p.name, 1),
      })),
    },
  ],
  sentMetadata: {
    sentAt: '2026-03-16T09:00:00.000Z',
    sentTo: 'jane.doe@example.com',
    sentBy: 'admin@hcat.com',
  },
  pdfMetadata: null,
};

function getExampleValue(name, sampleIdx) {
  const values = {
    'pH':                      ['7.2',  '6.9'],
    'Chlorine':                ['0.8',  '0.1'],
    'Sulfates':                ['45',   '62'],
    'Total Alkalinity':        ['120',  '95'],
    'Hardness':                ['180',  '210'],
    'Ammonia Nitrogen':        ['0.1',  '0.3'],
    'Coliform Bacteria':       ['',     '+'],
    'E. Coli Bacteria':        ['',     ''],
    'Total Iron':              ['0.12', '0.28'],
    'Manganese':               ['0.02', '0.04'],
    'Total Dissolved Solids':  ['320',  '410'],
    'Turbidity Raw':           ['1.2',  '3.5'],
    'Turbidity Filtered @ 20': ['0.4',  '0.9'],
    'Total PO4':               ['0.3',  '0.5'],
    'Total NO3':               ['4.2',  '6.8'],
    'Hydrogen Sulfide':        ['0.01', '0.03'],
  };
  return (values[name] || ['', ''])[sampleIdx];
}

export default MOCK_REPORT;
