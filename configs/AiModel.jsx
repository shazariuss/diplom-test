const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration:1 hours, NoOf Chapters:5, in JSON format in Uzbek Language.",
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '```json\n{\n  "course": {\n    "courseName": "Python Dasturlash Tiliga Kirish",\n    "description": "Ushbu kurs Python dasturlash tilining asosiy tushunchalari va sintaksisini o\'rgatadi. Kurs davomida siz o\'zgaruvchilar, ma\'lumot turlari, shartli operatorlar, tsikllar va funktsiyalar bilan ishlashni o\'rganasiz. Kurs yakunida siz kichik Python dasturlarini yozishga qodir bo\'lasiz.",\n    "category": "Dasturlash",\n    "topic": "Python",\n    "level": "Asosiy",\n    "duration": "1 soat",\n    "noOfChapters": 5,\n    "chapters": [\n      {\n        "chapterName": "1-bob: Python-ga Kirish",\n        "about": "Python dasturlash tili haqida umumiy ma\'lumot. Python-ning afzalliklari va qo\'llanilish sohalari. Python-ni o\'rnatish va sozlash.",\n        "duration": "10 daqiqa"\n      },\n      {\n        "chapterName": "2-bob: Ma\'lumot Turlari va O\'zgaruvchilar",\n        "about": "Asosiy ma\'lumot turlari (butun sonlar, kasr sonlar, satrlar, boolean). O\'zgaruvchilarni e\'lon qilish va ularga qiymat berish. Operatorlar.",\n        "duration": "15 daqiqa"\n      },\n      {\n        "chapterName": "3-bob: Shartli Operatorlar",\n        "about": "`if`, `elif`, `else` operatorlari. Shartli operatorlar yordamida dastur oqimini boshqarish.",\n        "duration": "15 daqiqa"\n      },\n      {\n        "chapterName": "4-bob: Tsikllar",\n        "about": "`for` va `while` tsikllari. Tsikllar yordamida kodni takrorlash. Tsikllarda `break` va `continue` operatorlari.",\n        "duration": "10 daqiqa"\n      },\n      {\n        "chapterName": "5-bob: Funktsiyalar",\n        "about": "Funktsiyalarni yaratish va chaqirish. Funktsiyalarga argumentlar berish va ulardan qiymat qaytarish. Mahalliy va global o\'zgaruvchilar.",\n        "duration": "10 daqiqa"\n      }\n    ]\n  }\n}\n```\n',
                },
            ],
        },
    ],
});

export const GenerateChapterContent_AI = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Explain the concept in Detail on Topic: Python Basic, Chapter:Variables and Data Types, in JSON Format with list of array with field as title, explanation on give chapter in detail, Code Example(Code field in <precode> format) if applicable in uzbek",
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '```json\n{\n  "topic": "Python Asoslari",\n  "chapter": "O\'zgaruvchilar va Ma\'lumot Turlari",\n  "sections": [\n    {\n      "title": "O\'zgaruvchilarga Kirish",\n      "explanation": "Python dasturlash tilida o\'zgaruvchi - bu ma\'lumotlarni saqlash uchun ishlatiladigan xotira manziliga berilgan ramziy nom. Uni ma\'lumotni saqlaydigan idish sifatida tasavvur qilish mumkin. Boshqa tillardan farqli ravishda, Python-da o\'zgaruvchining ma\'lumot turini aniq e\'lon qilish shart emas; u dinamik ravishda aniqlanadi. Bu o\'zgaruvchining turi ish jarayonida unga berilgan qiymat asosida aniqlanadi deganidir. O\'zgaruvchi nomlari harf регистрига сезгир ва муайян қоидаларга риоя қилиши керак (масалан, harf yoki pastki chiziq bilan boshlanishi, raqamlarni o\'z ichiga olishi mumkin, lekin birinchi belgisi sifatida emas, zahiralangan kalit so\'zlarni ishlatib бўлмаслиги лозим).",\n      "code_example": null\n    },\n    {\n      "title": "O\'zgaruvchilarga Qiymat Berish",\n      "explanation": "O\'zgaruvchiga qiymat berish \'=\' operatori orqali amalga oshiriladi. O\'ng tomondagi qiymat baholanadi va natija chap tomondagi o\'zgaruvchi nomi bilan bog\'lanadi. O\'zgaruvchiga dasturingizning istalgan joyida yangi qiymat berishingiz mumkin. Shuni yodda tutish kerakki, \'=\' - bu tayinlash operatori bo\'lib, tenglikni tekshirmaydi.",\n      "code_example": "<precode>x = 10\\nmessage = \\"Salom, Dunyo!\\"\\npi = 3.14159\\n\\nprint(x)\\nprint(message)\\nprint(pi)\\n\\nx = 20\\nprint(x) # Hozir 20 ni chop etadi\\n</precode>"\n\n    },\n    {\n      "title": "Umumiy Ma\'lumot Turlari",\n      "explanation": "Python turli xil ma\'lumot turlarini qo\'llab-quvvatlaydi. Ulardan eng asosiylari:",\n      "code_example": null\n    },\n    {\n      "title": "Butun Sonlar (int)",\n      "explanation": "Butun sonlar (int) kasr qismi bo\'lmagan butun sonlarni (musbat, manfiy va nol) ifodalaydi. Ular Python-da ixtiyoriy uzunlikda bo\'lishi mumkin (tizim xotirasi bilan cheklangan).",\n      "code_example": "<precode>age = 30\\ncount = -10\\nbig_number = 12345678901234567890\\nprint(type(age))\\nprint(type(big_number))\\n</precode>"\n     },\n    {\n      "title": "Haqiqiy Sonlar (float)",\n      "explanation": "Haqiqiy sonlar (float) kasr qismga ega bo\'lgan sonlar bo\'lib, haqiqiy sonlarni ifodalaydi. Ular kasr qiymatlarini yoki yuqori aniqlikdagi sonlarni ifodalash uchun ishlatiladi.",\n      "code_example": "<precode>price = 99.99\\ntemperature = 25.5\\npi = 3.14159\\nprint(type(price))\\n</precode>"\n\n    },\n    {\n      "title": "Satrlar (str)",\n      "explanation": "Satrlar (str) matnni ifodalash uchun ishlatiladigan belgilar ketma-ketligidir. Ular yoki bitta tirnoqlarda (`\'`) yoki ikkita tirnoqlarda (`\\"`) joylashgan. Ko\'p qatorli satrlar uch tirnoqlarda (`\'\'\'` yoki `\\"\\"\\"`) joylashtirilishi mumkin. Satrlar o\'zgarmasdir (yaratilgandan keyin o\'zgartirilmaydi).",\n      "code_example": "<precode>name = \'Alice\'\\ngreeting = \\"Salom!\\"\\nmultiline_string = \\\'\\\'\\\'Bu ko\'p\\nqatorli\\nsatr.\\\'\\\'\\\'\\nprint(type(name))\\nprint(multiline_string)\\n\\n#Satrlarning o\'zgarmasligi\\nstring1 = \\"test\\"\\n#string1[0] = \\"a\\" #Bu xatoni qaytaradi</precode>"\n    },\n     {\n      "title": "Mantiqiy Qiymatlar (bool)",\n      "explanation": "Mantiqiy qiymatlar (bool) rostlik qiymatlarini, yoki `True` yoki `False` ni ifodalaydi (katta harfga e\'tibor bering). Ular mantiqiy operatsiyalar natijasidir.",\n      "code_example": "<precode>is_active = True\\nlogged_in = False\\nprint(type(is_active))\\n</precode>"\n    },\n    {\n      "title": "`type()` bilan Ma\'lumot Turini Tekshirish",\n       "explanation": "Python-ning o\'rnatilgan `type()` funksiyasi sizga ish vaqtida o\'zgaruvchining ma\'lumot turini aniqlash imkonini beradi. Bu Python sizning ma\'lumotlaringizni qanday talqin qilayotganini tushunishga yordam beradi.",\n        "code_example": "<precode>x = 10\\nprint(type(x))  # Chiqarish: <class \'int\'>\\n\\ny = 3.14\\nprint(type(y))  # Chiqarish: <class \'float\'>\\n\\nz = \'Salom\'\\nprint(type(z)) # Chiqarish: <class \'str\'>\\n\\nb = True\\nprint(type(b)) # Chiqarish: <class \'bool\'>\\n</precode>"\n    },\n   {\n      "title": "Ma\'lumot Turini O\'zgartirish (Casting)",\n      "explanation": "Siz `int()`, `float()`, `str()` va `bool()` kabi o\'rnatilgan funksiyalardan foydalanib, ma\'lumot turlari o\'rtasida o\'zgartirish qilishingiz mumkin. E\'tibor bering, barcha o\'zgartirishlar mumkin emas va xatolarga olib kelishi mumkin (masalan, `\\"abc\\"` kabi o\'zgarmas satrni `int`ga o\'zgartirish).",\n      "code_example":"<precode>x = 10\\ny = float(x)\\nprint(y)  # Chiqarish: 10.0\\n\\nz = \\"123\\"\\nnum = int(z)\\nprint(num) # Chiqarish 123\\n\\nstr_num = str(123)\\nprint(type(str_num))\\n\\n\\nvalue = 0\\nbool_value = bool(value)\\nprint(bool_value) # Chiqarish: False\\n\\nvalue = 1\\nbool_value = bool(value)\\nprint(bool_value) # Chiqarish: True\\n\\n# Mumkin bo\'lmagan o\'zgartirish misoli\\n\\n#a = \\"abc\\"\\n#int_a = int(a) # Bu xatoni keltirib chiqaradi\\n</precode>"\n    }\n   ]\n}\n```',
                },
            ],
        },
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
