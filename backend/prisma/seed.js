import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Organization
  const padi = await prisma.organization.upsert({
    where: { name: 'PADI'},
    update: {},
    create: { name: 'PADI'},
  });

  const ssi = await prisma.organization.upsert({
    where: { name: 'SSI'},
    update: {},
    create: { name: 'SSI'},
  });

  const snsi = await prisma.organization.upsert({
    where: { name: 'SNSI'},
    update: {},
    create: { name: 'SNSI'},
  });

  // Country
  const countryArray = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'The Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo, Democratic Republic of the',
    'Congo, Republic of the',
    'Costa Rica',
    "Côte d’Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor (Timor-Leste)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "The Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, North",
    "Korea, South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sudan, South",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const countries = countryArray.map(async (country) => {
    const newCountry = await prisma.country.upsert({
      where: { name: country},
      update: {},
      create: { name: country},
    });

    return newCountry;
  });

  const thailand = await prisma.country.findUnique({
    where: {
      name: 'Thailand',
    },
    select: {
      id: true,
    }
  });

  const philippines = await prisma.country.findUnique({
    where: {
      name: 'Philippines',
    },
    select: {
      id: true,
    }
  });

  const japan = await prisma.country.findUnique({
    where: {
      name: 'Japan',
    },
    select: {
      id: true,
    }
  });

  const training = await prisma.divePurpose.upsert({
    where: { name: 'training'},
    update: {},
    create: { name: 'training'},
  });

  const recreational = await prisma.divePurpose.upsert({
    where: { name: 'recreational'},
    update: {},
    create: { name: 'recreational'},
  });

  const technical = await prisma.divePurpose.upsert({
    where: { name: 'technical'},
    update: {},
    create: { name: 'technical'},
  });

  // DiveCenter
  const divlogDivers = await prisma.diveCenter.upsert({
    where: { name: "DivLog Divers" },
    update: {},
    create: {
      name: "DivLog Divers",
      country_id: thailand.id,
      organization_id: padi.id,
    }
  });

  const ddDiveCenter = await prisma.diveCenter.upsert({
    where: { name: "DD Dive Center" },
    update: {},
    create: {
      name: "DD Dive Center",
      country_id: philippines.id,
      organization_id: padi.id,
    }
  });

  const dlDivers = await prisma.diveCenter.upsert({
    where: { name: "DL Divers" },
    update: {},
    create: {
      name: "DL Divers",
      country_id: thailand.id,
      organization_id: snsi.id,
    }
  });

  // User + DiverInfo
  // Hash password
  const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUND));
  const hashedPassword = await bcrypt.hash('testtest1234', salt);

  const aska = await prisma.user.upsert({
    where: { email: 'aska.tk6286@gmail.com'},
    update: {},
    create: {
      divlog_name: "aska62",
      license_name: "Aska Takahashi",
      email: 'aska.tk6286@gmail.com',
      password: hashedPassword,
      certification: 'Advanced Open Water',
      cert_org_id: padi.id,
    }
  });

  const askaDiverInfo = await prisma.diverInfo.upsert({
    where: { user_id: aska.id },
    update: {},
    create: {
      user_id: aska.id,
      norecord_dive_count: 32,
      height: 168.5,
      weight: 58,
      shoe: 25.5,
      measurement_unit: 1,
      languages: [
        'Japanese',
        'English',
        'Thai'
      ],
    }
  })

  const john = await prisma.user.upsert({
    where: { email: 'john@email.com'},
    update: {},
    create: {
      divlog_name: "johndiv",
      license_name: "John Smith Doe",
      email: 'john@email.com',
      password: hashedPassword,
      certification: 'Open Water',
      cert_org_id: ssi.id,
    }
  });

  const johnDiverInfo = await prisma.diverInfo.upsert({
    where: { user_id: john.id },
    update: {},
    create: {
      user_id: john.id,
      norecord_dive_count: 11,
      height: 182,
      weight: 76,
      shoe: 27,
      measurement_unit: 1,
      languages: [
        'English',
        'Spanish'
      ],
    }
  })

  const marissa = await prisma.user.upsert({
    where: { email: 'marissa@email.com'},
    update: {},
    create: {
      divlog_name: "marissa92",
      license_name: "Marissa Escobar",
      email: 'marissa@email.com',
      password: hashedPassword,
      certification: 'Instructor',
      cert_org_id: snsi.id,
    }
  });

  const marissaDiverInfo = await prisma.diverInfo.upsert({
    where: { user_id: marissa.id },
    update: {},
    create: {
      user_id: marissa.id,
      norecord_dive_count: 0,
      height: 162,
      weight: 55,
      shoe: 23.5,
      measurement_unit: 1,
      languages: [
        'Spanish',
      ],
    }
  })

  const brad = await prisma.user.upsert({
    where: { email: 'brad@email.com'},
    update: {},
    create: {
      divlog_name: "bradbrad",
      license_name: "Brad Timothy Cole",
      email: 'brad@email.com',
      password: hashedPassword,
      certification: 'Instructor',
      cert_org_id: snsi.id,
    }
  });

  const bradDiverInfo = await prisma.diverInfo.upsert({
    where: { user_id: brad.id },
    update: {},
    create: {
      user_id: brad.id,
      norecord_dive_count: 120,
      height: 190.2,
      weight: 86,
      shoe: 28.5,
      measurement_unit: 1,
      languages: [
        'English',
        'Chinese'
      ],
    }
  })

  // CenterStaff
  const centerStaff1 = {
    user_id: marissa.id,
    dive_center_id: dlDivers.id
  }
  const centerStaff2 = {
    user_id: brad.id,
    dive_center_id: divlogDivers.id
  }
  const centerStaff3 = {
    user_id: brad.id,
      dive_center_id: ddDiveCenter.id
  }

  const createCenterStaffs = await prisma.centerStaff.createMany({
    data: [
      centerStaff1,
      centerStaff2,
      centerStaff3,
    ],
    skipDuplicates: true,
  });

  // DiveRecord
  const diveRecord1 = {
    user_id: aska.id,
    log_no: 2,
    date: new Date('2023-08-28'),
    location: 'Green Lagoon, Colong',
    country_id: philippines.id,
    purpose_id: recreational.id,
    course: null,
    weather: 'Sunny',
    surface_temperature: 36,
    water_temperature: 32,
    max_depth: 28,
    visibility: 25,
    start_time: new Date('2023-08-28 10:35'),
    end_time: new Date('2023-08-28 11:03'),
    tankpressure_start: 200,
    tankpressure_end: 97,
    added_weight: 3,
    suit: '5mm wet',
    gears: '',
    buddy_ref: john.id,
    supervisor_ref: marissa.id,
    dive_center_id: dlDivers.id,
    notes: 'It was a great dive! We found a lot of beautiful fish. Lots of barracuda.',
    is_draft: false,
  }

  const diveRecord2 = {
    user_id: aska.id,
    log_no: 1,
    date: new Date('2023-08-28'),
    location: 'Blue Cave',
    country_id: philippines.id,
    purpose_id: recreational.id,
    course: null,
    weather: 'Sunny',
    surface_temperature: 36,
    water_temperature: 32,
    max_depth: 28,
    visibility: 25,
    start_time: new Date('2023-08-28 12:13'),
    end_time: new Date('2023-08-28 12:43'),
    tankpressure_start: 199,
    tankpressure_end: 87,
    added_weight: 3,
    suit: '5mm wet',
    gears: '',
    buddy_ref: john.id,
    supervisor_ref: marissa.id,
    dive_center_id: dlDivers.id,
    notes: null,
    is_draft: false,
  }

  const diveRecord3 = {
    user_id: aska.id,
    log_no: 3,
    date: new Date('2023-10-18'),
    location: 'Koh Tao',
    country_id: thailand.id,
    purpose_id: training.id,
    course: "Refresh",
    weather: 'Cloudy',
    surface_temperature: 34,
    water_temperature: 30,
    max_depth: 30,
    visibility: 20,
    start_time: new Date('2023-10-18 09:13'),
    end_time: new Date('2023-10-18 09:40'),
    tankpressure_start: 199,
    tankpressure_end: 87,
    added_weight: 3,
    suit: '5mm wet',
    gears: '',
    buddy_str: 'Takuki Mu',
    supervisor_str: 'Miki Yamamoto',
    dive_center_str: 'Fun Dive Miyako',
    notes: 'Great dive, fun training. It has been 6 months since the last dive. Nervous at the beginning, but I successfully enjoyed until the end thanks to the instructor Miki!',
    is_draft: false,
  }

  const diveRecord4 = {
    user_id: aska.id,
    log_no: 4,
    date: new Date('2023-12-29'),
    location: 'Blue Cave, Miyako',
    country_id: japan.id,
    purpose_id: recreational.id,
    course: null,
    weather: null,
    surface_temperature: null,
    water_temperature: null,
    max_depth: 30,
    visibility: null,
    start_time: new Date('2023-12-29 09:00'),
    end_time: null,
    tankpressure_start: null,
    tankpressure_end: null,
    added_weight: 3,
    suit: '5mm wet',
    gears: '',
    buddy_str: 'Takuki Mu',
    supervisor_str: 'Miki Yamamoto',
    dive_center_str: 'Fun Dive Miyako',
    notes: null,
    is_draft: true,
  }

  const createDiveRecord = await prisma.diveRecord.createMany({
    data: [
      diveRecord1,
      diveRecord2,
      diveRecord3,
      diveRecord4,
    ],
    skipDuplicates: true,
  });

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });