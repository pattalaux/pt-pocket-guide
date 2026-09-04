import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ROM_DATA = [
  { joint: "ไหล่ (Shoulder)", icon: "🦾", motions: [
    { name: "Flexion", normal: "0–180°", functional: "≥90°" },
    { name: "Extension", normal: "0–60°", functional: "≥30°" },
    { name: "Abduction", normal: "0–180°", functional: "≥90°" },
    { name: "Adduction", normal: "0–75°", functional: "≥30°" },
    { name: "IR (at side)", normal: "0–70°", functional: "≥45°" },
    { name: "ER (at side)", normal: "0–90°", functional: "≥45°" },
    { name: "Horizontal ABD", normal: "0–90°", functional: "-" },
    { name: "Horizontal ADD", normal: "0–130°", functional: "-" },
  ]},
  { joint: "ข้อศอก (Elbow)", icon: "💪", motions: [
    { name: "Flexion", normal: "0–145°", functional: "≥30°" },
    { name: "Extension", normal: "0°", functional: "0°" },
    { name: "Hyperextension", normal: "0–10°", functional: "-" },
    { name: "Supination", normal: "0–85°", functional: "≥50°" },
    { name: "Pronation", normal: "0–80°", functional: "≥50°" },
  ]},
  { joint: "ข้อมือ (Wrist)", icon: "✋", motions: [
    { name: "Flexion", normal: "0–80°", functional: "≥10°" },
    { name: "Extension", normal: "0–70°", functional: "≥35°" },
    { name: "Ulnar deviation", normal: "0–30°", functional: "-" },
    { name: "Radial deviation", normal: "0–20°", functional: "-" },
  ]},
  { joint: "นิ้วมือ (Fingers)", icon: "🤙", motions: [
    { name: "MCP Flexion (2–5)", normal: "0–90°", functional: "≥70°" },
    { name: "MCP Extension (2–5)", normal: "0–45°", functional: "-" },
    { name: "MCP ABD/ADD", normal: "0–25°", functional: "-" },
    { name: "PIP Flexion (2–5)", normal: "0–100°", functional: "≥60°" },
    { name: "PIP Extension (2–5)", normal: "0°", functional: "0°" },
    { name: "DIP Flexion (2–5)", normal: "0–90°", functional: "≥40°" },
    { name: "DIP Extension (2–5)", normal: "0–10°", functional: "-" },
  ]},
  { joint: "นิ้วโป้งมือ (Thumb)", icon: "👍", motions: [
    { name: "CMC Flexion", normal: "0–15°", functional: "-" },
    { name: "CMC Extension", normal: "0–20°", functional: "-" },
    { name: "CMC Abduction (radial)", normal: "0–70°", functional: "≥40°" },
    { name: "CMC Opposition", normal: "ปลายนิ้วแตะนิ้วก้อยได้", functional: "-" },
    { name: "MCP Flexion", normal: "0–60°", functional: "≥30°" },
    { name: "MCP Extension", normal: "0–10°", functional: "-" },
    { name: "IP Flexion", normal: "0–80°", functional: "≥30°" },
    { name: "IP Extension", normal: "0–20°", functional: "-" },
  ]},
  { joint: "สะโพก (Hip)", icon: "🦵", motions: [
    { name: "Flexion (knee flex)", normal: "0–120°", functional: "≥100°" },
    { name: "Flexion (knee ext)", normal: "0–90°", functional: "-" },
    { name: "Extension", normal: "0–30°", functional: "≥10°" },
    { name: "Abduction", normal: "0–45°", functional: "≥15°" },
    { name: "Adduction", normal: "0–30°", functional: "≥15°" },
    { name: "IR (hip 90°)", normal: "0–45°", functional: "-" },
    { name: "ER (hip 90°)", normal: "0–45°", functional: "-" },
  ]},
  { joint: "เข่า (Knee)", icon: "🦿", motions: [
    { name: "Flexion", normal: "0–135°", functional: "≥95°" },
    { name: "Extension", normal: "0°", functional: "0°" },
    { name: "Hyperextension", normal: "0–10°", functional: "-" },
  ]},
  { joint: "ข้อเท้า (Ankle)", icon: "🦶", motions: [
    { name: "Dorsiflexion (knee ext)", normal: "0–20°", functional: "≥10°" },
    { name: "Dorsiflexion (knee flex)", normal: "0–30°", functional: "-" },
    { name: "Plantarflexion", normal: "0–50°", functional: "≥20°" },
    { name: "Inversion (subtalar)", normal: "0–35°", functional: "-" },
    { name: "Eversion (subtalar)", normal: "0–25°", functional: "-" },
  ]},
  { joint: "นิ้วเท้า (Toes)", icon: "🦵", motions: [
    { name: "Hallux MTP Flexion", normal: "0–45°", functional: "-" },
    { name: "Hallux MTP Extension", normal: "0–70°", functional: "≥60°" },
    { name: "Hallux IP Flexion", normal: "0–90°", functional: "-" },
    { name: "Lesser toes MTP Flex", normal: "0–40°", functional: "-" },
    { name: "Lesser toes MTP Ext", normal: "0–40°", functional: "-" },
    { name: "Lesser toes PIP Flex", normal: "0–35°", functional: "-" },
    { name: "Lesser toes DIP Flex", normal: "0–60°", functional: "-" },
  ]},
  { joint: "คอ (Cervical)", icon: "🔄", motions: [
    { name: "Flexion (chin to chest)", normal: "0–45°", functional: "-" },
    { name: "Extension", normal: "0–45°", functional: "-" },
    { name: "Lateral flexion R", normal: "0–45°", functional: "-" },
    { name: "Lateral flexion L", normal: "0–45°", functional: "-" },
    { name: "Rotation R", normal: "0–60°", functional: "-" },
    { name: "Rotation L", normal: "0–60°", functional: "-" },
  ]},
  { joint: "อก (Thoracic)", icon: "🫁", motions: [
    { name: "Flexion", normal: "0–35°", functional: "-" },
    { name: "Extension", normal: "0–25°", functional: "-" },
    { name: "Lateral flexion", normal: "0–25°", functional: "-" },
    { name: "Rotation", normal: "0–35°", functional: "-" },
  ]},
  { joint: "หลัง (Lumbar)", icon: "🦴", motions: [
    { name: "Flexion (Schober)", normal: "≥5 cm (10→15 cm)", functional: "-" },
    { name: "Flexion (goniometer)", normal: "0–60°", functional: "-" },
    { name: "Extension", normal: "0–25°", functional: "-" },
    { name: "Lateral flexion R", normal: "0–25°", functional: "-" },
    { name: "Lateral flexion L", normal: "0–25°", functional: "-" },
    { name: "Rotation R", normal: "0–30°", functional: "-" },
    { name: "Rotation L", normal: "0–30°", functional: "-" },
  ]},
  { joint: "ขากรรไกร (TMJ)", icon: "😮", motions: [
    { name: "Mouth opening (inter-incisal)", normal: "40–55 mm", functional: "≥35 mm" },
    { name: "Lateral deviation R", normal: "8–12 mm", functional: "-" },
    { name: "Lateral deviation L", normal: "8–12 mm", functional: "-" },
    { name: "Protrusion", normal: "6–9 mm", functional: "-" },
    { name: "Retrusion", normal: "3–4 mm", functional: "-" },
  ]},
];

const CONDITIONS_DATA = [
  { name: "Frozen Shoulder", thai: "ไหล่ติด", category: "ไหล่", icon: "❄️",
    description: "ภาวะที่แคปซูลข้อไหล่หนาตัวและหดรั้ง ทำให้ ROM ลดลงทุกทิศทาง",
    signs: ["Capsular pattern: ER > Abd > IR", "Night pain", "Global ROM loss"],
    tests: [
      { name: "Shoulder ROM assessment", result: "Capsular pattern ลด",
        desc: "วัด active ROM ไหล่ทุกทิศ เปรียบเทียบสองข้าง ใน frozen shoulder จะลดทุกทิศโดยเฉพาะ ER มากที่สุด",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Shoulder_abduction_and_adduction.gif/220px-Shoulder_abduction_and_adduction.gif" },
      { name: "Apley Scratch Test", result: "ทำไม่ได้หรือเจ็บ",
        desc: "ยกมือขึ้นแตะสะบักฝั่งตรงข้าม (flex+ER) และสอดมือไปด้านหลังแตะสะบักฝั่งเดิม (ext+IR) ประเมิน functional ROM ทั้ง 2 ทิศ",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Apley_scratch_test.jpg/320px-Apley_scratch_test.jpg" },
    ], phase: ["Freezing", "Frozen", "Thawing"] },

  { name: "Rotator Cuff Tear", thai: "เอ็นข้อไหล่ฉีก", category: "ไหล่", icon: "💥",
    description: "การฉีกขาดของกล้ามเนื้อ/เอ็น rotator cuff (Supraspinatus พบบ่อยสุด)",
    signs: ["Painful arc 60–120°", "Weakness ER/Abd", "Drop arm sign"],
    tests: [
      { name: "Empty Can Test (Jobe's)", result: "+ = weakness/pain with resisted abduction",
        desc: "ยกแขน abduction 90° plane of scapula หมุน IR (นิ้วโป้งชี้พื้น) ผู้ตรวจกดแขนลง ถ้าอ่อนแรงหรือเจ็บ = supraspinatus positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/EmptyCan.jpg/320px-EmptyCan.jpg" },
      { name: "Drop Arm Test", result: "+ = ไม่สามารถลดแขนช้าๆได้",
        desc: "ยกแขน abduction 90° แล้วให้ค่อยๆ ลดแขนลงช้าๆ ถ้า cuff ฉีก แขนจะตกทันทีควบคุมไม่ได้",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Drop_arm_sign.jpg/280px-Drop_arm_sign.jpg" },
      { name: "Lift-off Test (Gerber)", result: "+ = ไม่สามารถยกมือออกจากหลังได้",
        desc: "วางมือด้านหลังหลัง (IR) แล้วพยายามยกมือออกจากหลัง ถ้าทำไม่ได้ = subscapularis tear",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lift_off_test.jpg/280px-Lift_off_test.jpg" },
      { name: "External Rotation Lag Sign", result: "+ = แขนตกกลับ IR เองเมื่อปล่อย",
        desc: "ผู้ตรวจ ER แขนผู้ป่วยไว้ที่สุด แล้วปล่อยมือ ถ้าแขนตกกลับสู่ IR เองโดยไม่รักษาตำแหน่ง = infraspinatus/teres minor tear",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/ER_lag_sign.jpg/280px-ER_lag_sign.jpg" },
    ]},

  { name: "Subacromial Impingement", thai: "เอ็นหนีบใต้กระดูก", category: "ไหล่", icon: "📌",
    description: "การกดทับเนื้อเยื่อใต้ acromion ขณะยกแขน",
    signs: ["Painful arc 70–120°", "Night pain", "Pain with overhead"],
    tests: [
      { name: "Neer's Test", result: "+ = pain on passive forward flexion",
        desc: "กด scapula ไว้ แล้ว passive flex แขนขึ้นเต็มที่ ทำให้ supraspinatus ชนกับ anterior acromion ถ้าเจ็บ = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Neer_impingement_sign.jpg/280px-Neer_impingement_sign.jpg" },
      { name: "Hawkins-Kennedy Test", result: "+ = pain on passive IR at 90° flex",
        desc: "ยกแขน flex 90° งอศอก 90° แล้ว passive IR ไหล่ forceful ทำให้ supraspinatus ถูกกดใต้ coracoacromial arch ถ้าเจ็บ = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Hawkins-Kennedy.jpg/280px-Hawkins-Kennedy.jpg" },
      { name: "Empty Can Test", result: "+ = supraspinatus involvement",
        desc: "ยกแขน abduction 90° หมุน IR ผู้ตรวจกดต้านทาน ทดสอบ supraspinatus strength และ impingement",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/EmptyCan.jpg/320px-EmptyCan.jpg" },
    ]},

  { name: "Tennis Elbow", thai: "เอ็นข้อศอกนอกอักเสบ", category: "ศอก", icon: "🎾",
    description: "การบาดเจ็บที่ ECRB บริเวณ lateral epicondyle",
    signs: ["Pain lateral epicondyle", "Weak grip", "Pain with wrist ext"],
    tests: [
      { name: "Cozen's Test", result: "+ = pain lateral epicondyle with resisted wrist ext",
        desc: "จับศอกไว้ ให้ผู้ป่วย pronate forearm ทำ resisted wrist extension ถ้าเจ็บที่ lateral epicondyle = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cozens_test.jpg/280px-Cozens_test.jpg" },
      { name: "Mill's Test", result: "+ = pain on passive wrist flex + elbow ext",
        desc: "passive wrist flex + forearm pronation + elbow extension พร้อมกัน ยืด ECRB เต็มที่ ถ้าเจ็บ lateral epicondyle = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mills_test.jpg/280px-Mills_test.jpg" },
      { name: "Maudsley's Test", result: "+ = pain resisted 3rd finger extension",
        desc: "ให้ผู้ป่วยต้านการกด flex นิ้วกลาง (3rd finger) ขณะศอกเหยียด โหลด ECRB โดยตรง ถ้าเจ็บ lateral epicondyle = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Maudsley_test.jpg/280px-Maudsley_test.jpg" },
    ]},

  { name: "Golfer's Elbow", thai: "เอ็นข้อศอกในอักเสบ", category: "ศอก", icon: "⛳",
    description: "การบาดเจ็บที่ flexor-pronator mass บริเวณ medial epicondyle",
    signs: ["Pain medial epicondyle", "Pain with grip/flex wrist"],
    tests: [
      { name: "Medial Epicondyle Palpation", result: "+ = point tenderness at medial epicondyle",
        desc: "คลำตรง medial epicondyle ถ้าเจ็บแปลบ = positive บ่งชี้ medial epicondylalgia (flexor-pronator origin)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Medial_epicondyle_palpation.jpg/280px-Medial_epicondyle_palpation.jpg" },
      { name: "Resisted Wrist Flexion", result: "+ = pain medial epicondyle",
        desc: "ผู้ป่วย supinate forearm งอข้อมือต้านแรงผู้ตรวจ ถ้าเจ็บ medial epicondyle = positive ทดสอบ flexor-pronator origin",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Resisted_wrist_flexion_test.jpg/280px-Resisted_wrist_flexion_test.jpg" },
    ]},

  { name: "Knee OA", thai: "ข้อเข่าเสื่อม", category: "เข่า", icon: "🦴",
    description: "การสึกของกระดูกอ่อนผิวข้อเข่า มักพบในผู้สูงอายุ",
    signs: ["Crepitus", "Morning stiffness <30 min", "Bony enlargement"],
    tests: [
      { name: "McMurray's Test", result: "+ = click/pain on rotation = meniscus",
        desc: "นอนหงาย งอเข่า full flex ER + valgus ขณะ extend ช้าๆ (medial meniscus) หรือ IR + varus (lateral) ได้ยิน/รู้สึก click = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/McMurray_test.jpg/280px-McMurray_test.jpg" },
      { name: "Valgus Stress Test", result: "+ = medial joint pain/gapping = MCL",
        desc: "เข่า 0° และ 30° flex ออกแรง valgus stress ที่เข่า ถ้า gapping หรือเจ็บ medial = MCL laxity",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Valgus_stress_test.jpg/280px-Valgus_stress_test.jpg" },
      { name: "Varus Stress Test", result: "+ = lateral joint pain/gapping = LCL",
        desc: "ออกแรง varus stress ที่เข่า 0° และ 30° ถ้า gapping หรือเจ็บ lateral = LCL laxity",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Varus_stress_test.jpg/280px-Varus_stress_test.jpg" },
      { name: "Patella Grind Test", result: "+ = pain/crepitus = patellofemoral OA",
        desc: "กด patella ลงแล้วเลื่อน superior-inferior ขณะ quad contract เบาๆ ถ้าเจ็บหรือ crepitus = patellofemoral involvement",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Patella_grind.jpg/280px-Patella_grind.jpg" },
    ]},

  { name: "ACL Injury", thai: "เอ็นไขว้หน้าเข่าขาด", category: "เข่า", icon: "⚡",
    description: "การฉีกขาดของ ACL มักเกิดจาก pivot/hyperextension",
    signs: ["Pop sound", "Immediate swelling", "Giving way"],
    tests: [
      { name: "Lachman Test", result: "+ = soft end feel, anterior translation >3mm",
        desc: "นอนหงาย เข่า 20–30° flex จับ distal femur + proximal tibia ดึง tibia ไปด้านหน้า soft end feel + translation >3mm = ACL positive (sensitivity สูงสุด ~85%)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lachman_test.jpg/280px-Lachman_test.jpg" },
      { name: "Anterior Drawer Test", result: "+ = anterior tibial translation at 90° flex",
        desc: "นอนหงาย เข่า 90° flex นั่งทับเท้าผู้ป่วย ดึง tibia ไปด้านหน้าสองมือ ถ้า tibia เลื่อนออกโดยไม่มี hard end feel = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Anterior_drawer_knee.jpg/280px-Anterior_drawer_knee.jpg" },
      { name: "Pivot Shift Test", result: "+ = clunk on valgus+IR = rotatory instability",
        desc: "ยืดเข่า ออก valgus + IR ที่ leg ขณะ flex เข่าช้าๆ ถ้า tibial plateau sublux แล้ว reduce พร้อมเสียง/ความรู้สึก clunk = anterolateral instability positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Pivot_shift.jpg/280px-Pivot_shift.jpg" },
    ]},

  { name: "Meniscus Tear", thai: "หมอนรองเข่าฉีก", category: "เข่า", icon: "🌀",
    description: "การฉีกขาดของ medial หรือ lateral meniscus มักเกิดจาก twisting",
    signs: ["Joint line tenderness", "Locking/catching", "Swelling after activity"],
    tests: [
      { name: "McMurray's Test", result: "+ = click/pain on tibial rotation",
        desc: "งอเข่า full flex ER + valgus ขณะ extend (medial meniscus) หรือ IR + varus (lateral) ได้ยิน click หรือเจ็บ joint line = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/McMurray_test.jpg/280px-McMurray_test.jpg" },
      { name: "Thessaly Test", result: "+ = discomfort/locking at 20° knee flex",
        desc: "ยืนขาเดียว เข่า 20° flex บิดตัว IR/ER 3 ครั้ง ถ้ารู้สึก catching หรือเจ็บ joint line = positive (sensitivity สูงกว่า McMurray ~90%)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Thessaly_test.jpg/280px-Thessaly_test.jpg" },
      { name: "Apley's Compression Test", result: "+ = pain on compression+rotation (prone)",
        desc: "นอนคว่ำ เข่า 90° flex กดน้ำหนักลงผ่านเท้า + rotate tibia ถ้าเจ็บ = meniscus; distraction แล้วเจ็บ = ligament",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Apley_test.jpg/280px-Apley_test.jpg" },
    ]},

  { name: "Plantar Fasciitis", thai: "พังผืดฝ่าเท้าอักเสบ", category: "เท้า", icon: "👣",
    description: "การอักเสบของ plantar fascia บริเวณ calcaneal insertion",
    signs: ["First step pain AM", "Pain medial heel", "Pain worsens prolonged standing"],
    tests: [
      { name: "Windlass Test", result: "+ = heel pain on passive toe extension",
        desc: "ผู้ป่วยยืน/นั่ง ผู้ตรวจ passive dorsiflex นิ้วหัวแม่เท้าขึ้น ทำให้ plantar fascia ตึง ถ้าเจ็บ medial heel = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Windlass_mechanism.jpg/280px-Windlass_mechanism.jpg" },
      { name: "Heel Palpation", result: "+ = medial calcaneal tubercle tenderness",
        desc: "คลำตรง medial calcaneal tubercle กดลงให้ลึก ถ้าเจ็บแปลบมาก = pathognomonic สำหรับ plantar fasciitis",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Plantar_heel_palpation.jpg/280px-Plantar_heel_palpation.jpg" },
    ]},

  { name: "Cervical Radiculopathy", thai: "เส้นประสาทคอถูกกดทับ", category: "คอ", icon: "⚡",
    description: "การกดทับ nerve root บริเวณ cervical spine ทำให้ปวดร้าวลงแขน",
    signs: ["Dermatomal pain/paresthesia", "Myotomal weakness", "Reflex changes"],
    tests: [
      { name: "Spurling's Test", result: "+ = ipsilateral radicular pain reproduction",
        desc: "ให้ผู้ป่วย lateral flex + rotate คอไปฝั่ง symptomatic แล้วผู้ตรวจกดหัวลงเบาๆ (axial compression) ถ้าปวดร้าวลงแขนข้างเดิม = positive (foraminal narrowing)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Spurling_test.jpg/280px-Spurling_test.jpg" },
      { name: "Cervical Distraction Test", result: "+ = symptom relief on axial traction",
        desc: "ยก head ขึ้นเบาๆ ด้วย axial traction ประมาณ 10–15 lb ถ้าอาการปวดร้าวหรือชาลดลง = positive บ่งว่า foraminal compression",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Cervical_distraction.jpg/280px-Cervical_distraction.jpg" },
      { name: "ULNT1 (Median nerve bias)", result: "+ = neurogenic symptoms reproduced",
        desc: "Depress shoulder → ABD 110° → ER → extend elbow → supinate forearm → extend wrist+fingers → lateral flex head away ถ้า reproduction อาการร้าว/ชา และลดลงเมื่อ flex คอกลับ = neural tension positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ULNT1_median.jpg/280px-ULNT1_median.jpg" },
    ]},

  { name: "LBP / Disc Herniation", thai: "หมอนรองกระดูกทับเส้น", category: "หลัง", icon: "🔴",
    description: "การเคลื่อนของ nucleus pulposus กดทับ nerve root บริเวณ lumbar",
    signs: ["Dermatomal leg pain", "Positive SLR", "Centralization phenomenon"],
    tests: [
      { name: "Straight Leg Raise (SLR)", result: "+ = radicular pain 30–70° hip flex",
        desc: "นอนหงาย ยก leg ขึ้น passive hip flex เข่าเหยียด ถ้าปวดร้าวลงขาตาม dermatome ที่ 30–70° = positive L4–S1 (ปวดหลังธรรมดาไม่นับ)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Straight_leg_raise.jpg/280px-Straight_leg_raise.jpg" },
      { name: "Slump Test", result: "+ = neurogenic symptoms reproduced",
        desc: "นั่งริมเตียง slump หลัง งอคอ เหยียดเข่า dorsiflex เท้าทีละขั้น ถ้าปวด/ชาร้าวลงขา และลดลงเมื่อ extend คอ = neural tension positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Slump_test_position.jpg/280px-Slump_test_position.jpg" },
      { name: "Crossed SLR (Well Leg Raise)", result: "+ = contralateral symptoms = large herniation",
        desc: "ยก leg ข้างที่ไม่มีอาการ แล้วเกิดอาการปวดที่ขาข้างมีอาการ = crossed SLR positive บ่งถึง large central disc herniation",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crossed_SLR_test.jpg/280px-Crossed_SLR_test.jpg" },
    ]},

  { name: "Carpal Tunnel Syndrome", thai: "เส้นประสาทข้อมือถูกกดทับ", category: "มือ", icon: "🤲",
    description: "การกดทับ median nerve ผ่าน carpal tunnel",
    signs: ["Paresthesia thumb/index/middle", "Thenar weakness", "Night symptoms"],
    tests: [
      { name: "Phalen's Test", result: "+ = paresthesia median distribution ใน 60 วิ",
        desc: "งอข้อมือ max passive flex ทั้งสองข้างค้างไว้ 60 วินาที ถ้าชา/เสียวแปลบนิ้วโป้ง นิ้วชี้ นิ้วกลาง = positive",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Phalens_test.jpg/280px-Phalens_test.jpg" },
      { name: "Tinel's Sign", result: "+ = tingling/electric shock on tapping",
        desc: "เคาะเบาๆ ที่บริเวณ carpal tunnel (volar ข้อมือ) ถ้ารู้สึกเสียวไฟฟ้าหรือชาร้าวไปนิ้ว = positive บ่งชี้ median nerve irritation",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Tinels_sign.jpg/280px-Tinels_sign.jpg" },
      { name: "Carpal Compression Test (Durkan)", result: "+ = symptoms ใน 30 วิ",
        desc: "กดนิ้วโป้งทั้งสองลงบน carpal tunnel โดยตรงนาน 30 วินาที ถ้าเกิด paresthesia median = positive (sensitivity > Phalen's)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Durkan_compression.jpg/280px-Durkan_compression.jpg" },
    ]},

  { name: "Hip OA", thai: "ข้อสะโพกเสื่อม", category: "สะโพก", icon: "🔵",
    description: "การสึกของกระดูกอ่อนข้อสะโพก มักพบ IR, flex restriction",
    signs: ["Groin/lateral hip pain", "Capsular pattern: IR > Flex > Abd"],
    tests: [
      { name: "FABER Test (Patrick's)", result: "+ = groin or SI pain",
        desc: "นอนหงาย วาง foot ข้างทดสอบบน knee อีกข้าง (figure-4) ปล่อย leg ตกลง passive ถ้าเจ็บ groin = hip; เจ็บ SI = sacroiliac joint",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/FABER_test_position.jpg/280px-FABER_test_position.jpg" },
      { name: "FADIR Test", result: "+ = anterior hip/groin pain = FAI หรือ labral",
        desc: "นอนหงาย passive hip flex 90° + ADD + IR พร้อมกัน ถ้าเจ็บ anterior hip/groin = femoroacetabular impingement หรือ labral tear",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/FADIR_test_position.jpg/280px-FADIR_test_position.jpg" },
      { name: "Log Roll Test", result: "+ = groin pain on passive ER/IR",
        desc: "นอนหงาย เข่าเหยียด กลิ้ง leg ไป ER และ IR เบาๆ ถ้าเจ็บ groin = hip joint pathology (sensitive แต่ not specific)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Log_roll_test_hip.jpg/280px-Log_roll_test_hip.jpg" },
    ]},
]
const DERMATOME_DATA = [
  { level: "C5", motor: "Deltoid, Biceps", sensory: "Lateral arm", reflex: "Biceps" },
  { level: "C6", motor: "Wrist ext (ECRL)", sensory: "Lateral forearm, thumb", reflex: "Brachioradialis" },
  { level: "C7", motor: "Triceps, Wrist flex", sensory: "Middle finger", reflex: "Triceps" },
  { level: "C8", motor: "Finger flex, Intrinsics", sensory: "Medial forearm, ring/little", reflex: "-" },
  { level: "T1", motor: "Intrinsics", sensory: "Medial arm", reflex: "-" },
  { level: "L3", motor: "Quad, Hip flex", sensory: "Anterior thigh", reflex: "Patella (partial)" },
  { level: "L4", motor: "Tibialis anterior", sensory: "Medial leg/foot", reflex: "Patella" },
  { level: "L5", motor: "EHL, Peronei", sensory: "Lateral leg, dorsum foot", reflex: "-" },
  { level: "S1", motor: "Gastrosoleus, Peroneals", sensory: "Lateral/plantar foot", reflex: "Achilles" },
];

const MMT_DATA = [
  { grade: "0", thai: "ไม่หดตัวเลย", description: "ไม่มีการหดตัวของกล้ามเนื้อเลย" },
  { grade: "1", thai: "หดติ๊กเดียว", description: "Trace / flicker, no movement" },
  { grade: "2-", thai: "ROM บางส่วน (ลบแรงโน้มถ่วง)", description: "Partial ROM, gravity eliminated" },
  { grade: "2", thai: "ROM เต็ม ลบแรงโน้มถ่วง", description: "Full ROM, gravity eliminated" },
  { grade: "2+", thai: "เพิ่มแรงต้านเล็กน้อย", description: "Full ROM, gravity elim + minimal resistance" },
  { grade: "3-", thai: "ROM บางส่วน สู้แรงโน้มถ่วง", description: "Partial ROM against gravity" },
  { grade: "3", thai: "สู้แรงโน้มถ่วงได้เต็ม", description: "Full ROM against gravity, no resistance" },
  { grade: "3+", thai: "ต้านแรงเล็กน้อยได้", description: "Full ROM + minimal resistance" },
  { grade: "4-", thai: "ต้านแรงได้บ้าง", description: "Full ROM + some resistance" },
  { grade: "4", thai: "ต้านแรงได้ปานกลาง", description: "Full ROM + moderate resistance" },
  { grade: "4+", thai: "ต้านได้เกือบปกติ", description: "Full ROM + near full resistance" },
  { grade: "5", thai: "ปกติ", description: "Full ROM + full resistance = normal" },
];

const OUTCOME_MEASURES = [
  { name: "VAS / NRS", icon: "📊", category: "Pain",
    description: "Visual Analogue Scale / Numeric Rating Scale วัดความเจ็บปวด 0–10",
    howto: "ให้ผู้ป่วยให้คะแนนความเจ็บปวด โดย 0 = ไม่เจ็บเลย, 10 = เจ็บสุดๆ",
    interpret: [
      { range: "0", meaning: "ไม่เจ็บปวด", color: "#22c55e" },
      { range: "1–3", meaning: "เจ็บน้อย (Mild)", color: "#84cc16" },
      { range: "4–6", meaning: "เจ็บปานกลาง (Moderate)", color: "#f59e0b" },
      { range: "7–9", meaning: "เจ็บมาก (Severe)", color: "#ef4444" },
      { range: "10", meaning: "เจ็บรุนแรงที่สุด", color: "#dc2626" },
    ], mcid: "MCID = 2 คะแนน (หรือ 30% reduction)" },

  { name: "Barthel Index", icon: "🏠", category: "Function",
    description: "วัด ADL independence ใน 10 กิจกรรม คะแนนรวม 0–100",
    howto: "ประเมิน 10 กิจกรรม: Feeding, Bathing, Grooming, Dressing, Bowel, Bladder, Toilet, Transfer, Mobility, Stairs",
    interpret: [
      { range: "0–20", meaning: "พึ่งพาอย่างมาก (Total dependence)", color: "#ef4444" },
      { range: "21–60", meaning: "พึ่งพามาก (Severe dependence)", color: "#f97316" },
      { range: "61–90", meaning: "พึ่งพาปานกลาง (Moderate)", color: "#f59e0b" },
      { range: "91–99", meaning: "พึ่งพาเล็กน้อย (Slight)", color: "#84cc16" },
      { range: "100", meaning: "ช่วยตัวเองได้เต็มที่", color: "#22c55e" },
    ], mcid: "MCID = 1.85 คะแนน (stroke)" },

  { name: "Berg Balance Scale", icon: "⚖️", category: "Balance",
    description: "วัด static & dynamic balance 14 รายการ คะแนน 0–56",
    howto: "ประเมิน 14 tasks เช่น sit-to-stand, standing unsupported, reaching forward, turning ฯลฯ",
    interpret: [
      { range: "0–20", meaning: "เสี่ยงหกล้มสูงมาก (High fall risk)", color: "#ef4444" },
      { range: "21–40", meaning: "เสี่ยงหกล้มปานกลาง", color: "#f59e0b" },
      { range: "41–56", meaning: "เสี่ยงหกล้มน้อย (Low risk)", color: "#22c55e" },
    ], mcid: "MCID = 4–7 คะแนน", cutoff: "Cutoff ≤45 = เสี่ยงหกล้ม" },

  { name: "Tinetti POMA", icon: "🚶", category: "Balance/Gait",
    description: "Performance Oriented Mobility Assessment วัด balance + gait คะแนน 0–28",
    howto: "Balance subscale (0–16) + Gait subscale (0–12)",
    interpret: [
      { range: "<19", meaning: "เสี่ยงหกล้มสูง", color: "#ef4444" },
      { range: "19–24", meaning: "เสี่ยงหกล้มปานกลาง", color: "#f59e0b" },
      { range: "25–28", meaning: "เสี่ยงน้อย", color: "#22c55e" },
    ], mcid: "Cutoff <26 = fall risk" },

  { name: "DASH Score", icon: "💪", category: "UE Function",
    description: "Disabilities of Arm, Shoulder, Hand วัด UE function 30 items คะแนน 0–100",
    howto: "30 คำถามเกี่ยวกับ ADL, งาน, สังคม (0 = ไม่มีปัญหา, 100 = ปัญหาสูงสุด)",
    interpret: [
      { range: "0–20", meaning: "Minimal disability", color: "#22c55e" },
      { range: "21–40", meaning: "Mild disability", color: "#84cc16" },
      { range: "41–60", meaning: "Moderate disability", color: "#f59e0b" },
      { range: "61–80", meaning: "Severe disability", color: "#f97316" },
      { range: "81–100", meaning: "Extreme disability", color: "#ef4444" },
    ], mcid: "MCID = 10–15 คะแนน" },

  { name: "KOOS", icon: "🦵", category: "เข่า",
    description: "Knee Injury & Osteoarthritis Outcome Score 5 subscales คะแนน 0–100 (100 = ดีที่สุด)",
    howto: "5 subscales: Pain, Symptoms, ADL, Sport/Recreation, Quality of Life",
    interpret: [
      { range: "≥75", meaning: "ผลดี (Good outcome)", color: "#22c55e" },
      { range: "50–74", meaning: "ผลพอใช้ (Fair)", color: "#f59e0b" },
      { range: "<50", meaning: "ผลไม่ดี (Poor)", color: "#ef4444" },
    ], mcid: "MCID = 8–10 คะแนน" },

  { name: "Modified Rankin Scale", icon: "🧠", category: "Stroke",
    description: "วัดระดับ disability หลัง stroke คะแนน 0–6",
    howto: "สัมภาษณ์และสังเกตการทำกิจกรรมประจำวัน",
    interpret: [
      { range: "0", meaning: "ไม่มีอาการเลย", color: "#22c55e" },
      { range: "1", meaning: "มีอาการเล็กน้อย ไม่กระทบชีวิต", color: "#84cc16" },
      { range: "2", meaning: "พิการเล็กน้อย ช่วยตัวเองได้", color: "#a3e635" },
      { range: "3", meaning: "พิการปานกลาง ต้องการความช่วยเหลือ", color: "#f59e0b" },
      { range: "4", meaning: "พิการมาก ต้องการดูแลตลอด", color: "#f97316" },
      { range: "5", meaning: "พิการรุนแรง ต้องการการดูแลอย่างเต็มที่", color: "#ef4444" },
      { range: "6", meaning: "เสียชีวิต", color: "#7f1d1d" },
    ], mcid: "mRS ≤2 = favourable outcome" },

  { name: "Borg RPE Scale", icon: "❤️", category: "Exertion",
    description: "Rating of Perceived Exertion วัดความหนักในการออกกำลังกาย 6–20",
    howto: "ให้ผู้ป่วยประเมินความหนักในการออกกำลังกาย ขณะทำ exercise",
    interpret: [
      { range: "6–8", meaning: "เบามาก (Very light)", color: "#22c55e" },
      { range: "9–11", meaning: "เบา (Light)", color: "#84cc16" },
      { range: "12–13", meaning: "ปานกลาง (Somewhat hard)", color: "#f59e0b" },
      { range: "14–16", meaning: "หนัก (Hard)", color: "#f97316" },
      { range: "17–20", meaning: "หนักมาก (Very hard/Max)", color: "#ef4444" },
    ], mcid: "Target zone = 12–14 สำหรับ moderate exercise" },
];

const RED_FLAGS = [
  { category: "Spinal / Neurological 🧠", color: "#ef4444", flags: [
    { flag: "Saddle anaesthesia", detail: "ชาบริเวณ perineum → สงสัย Cauda Equina" },
    { flag: "Bladder/Bowel dysfunction", detail: "กลั้นปัสสาวะ/อุจจาระไม่ได้ หรือ retention → Cauda Equina Emergency" },
    { flag: "Bilateral leg weakness/numbness", detail: "อ่อนแรงสองข้าง → Myelopathy/Cauda Equina" },
    { flag: "Progressive neurological deficit", detail: "อ่อนแรงลงเรื่อยๆ → ต้องส่งต่อด่วน" },
    { flag: "Gait ataxia", detail: "เดินเซ ประสาน → Upper motor neuron lesion" },
  ]},
  { category: "Malignancy / Infection 🔴", color: "#dc2626", flags: [
    { flag: "ประวัติมะเร็ง", detail: "History of cancer → ต้องนึกถึง metastasis เสมอ" },
    { flag: "น้ำหนักลดโดยไม่ทราบสาเหตุ", detail: ">10% ใน 6 เดือน → Red flag for malignancy" },
    { flag: "ปวดรุนแรงช่วง rest/กลางคืน", detail: "Night pain ไม่ดีขึ้นจากท่า → Bone mets / Infection" },
    { flag: "ไข้ หนาวสั่น เหงื่อออกกลางคืน", detail: "Systemic infection, TB spine" },
    { flag: "ปวดไม่ตอบสนองต่อ conservative Rx", detail: "ไม่ดีขึ้นใน 4–6 สัปดาห์" },
  ]},
  { category: "Cardiovascular / Systemic ❤️", color: "#f97316", flags: [
    { flag: "Chest pain + dyspnea", detail: "Cardiac origin → ห้ามออกกำลังกาย ส่งต่อทันที" },
    { flag: "Resting HR >100 bpm หรือ <50 bpm", detail: "ประเมินก่อน exercise" },
    { flag: "BP >180/110 หรือ <90/60", detail: "ควบคุมก่อน exercise" },
    { flag: "Uncontrolled DM", detail: "Blood sugar >250 mg/dL → หยุด exercise" },
    { flag: "DVT signs", detail: "บวม แดง ร้อนน่อง → Homans' sign → ห้าม massage/exercise" },
  ]},
  { category: "Trauma / Fracture ⚠️", color: "#f59e0b", flags: [
    { flag: "ประวัติ trauma รุนแรง", detail: "High-velocity injury → ต้อง rule out fracture ก่อน" },
    { flag: "Osteoporosis + minor trauma", detail: "แม้แค่ไอหรือก้มก็ fracture ได้" },
    { flag: "Steroid long-term use", detail: "เสี่ยง osteoporotic fracture สูง" },
    { flag: "Deformity / step-off", detail: "ตรวจพบ deformity ชัดเจน → X-ray ก่อน" },
  ]},
  { category: "Inflammatory / Autoimmune 🔵", color: "#818cf8", flags: [
    { flag: "Morning stiffness >1 hr", detail: "RA, AS → ต้องประเมิน inflammatory arthritis" },
    { flag: "Peripheral joint swelling หลายข้อ", detail: "Polyarthritis → rheumatology referral" },
    { flag: "ผื่น skin manifestation", detail: "Psoriatic arthritis, SLE" },
    { flag: "ตาแดง iritis/uveitis", detail: "AS associated condition" },
  ]},
];

const ELECTRO_DATA = [
  { modality: "TENS (Conventional)", icon: "⚡", indication: "Acute/chronic pain",
    params: [
      { label: "Frequency", value: "80–150 Hz" },
      { label: "Pulse width", value: "50–100 µs" },
      { label: "Intensity", value: "Strong tingling, no muscle contraction" },
      { label: "Duration", value: "20–30 นาที" },
      { label: "Mode", value: "Continuous" },
    ],
    contra: ["Pacemaker", "Over carotid sinus", "Pregnancy (abdomen)", "Active bleeding"],
    note: "ไม่มี carryover effect ดีสำหรับ pain control ระหว่าง treatment" },

  { modality: "TENS (Acupuncture-like)", icon: "⚡", indication: "Chronic pain, endorphin release",
    params: [
      { label: "Frequency", value: "1–4 Hz" },
      { label: "Pulse width", value: "150–300 µs" },
      { label: "Intensity", value: "Visible muscle twitch" },
      { label: "Duration", value: "20–30 นาที" },
      { label: "Mode", value: "Burst หรือ Low-rate continuous" },
    ],
    contra: ["Pacemaker", "Pregnancy", "Malignancy area"],
    note: "Carryover effect หลายชั่วโมง ใช้กับ acupuncture points" },

  { modality: "Ultrasound (US)", icon: "🔊", indication: "Soft tissue healing, scar, calcification",
    params: [
      { label: "Frequency", value: "1 MHz (deep >3cm) / 3 MHz (superficial)" },
      { label: "Intensity", value: "0.5–2.0 W/cm²" },
      { label: "Mode", value: "Continuous (thermal) / Pulsed 1:4 (non-thermal)" },
      { label: "Duration", value: "5–10 นาที ต่อ ERA" },
      { label: "ERA", value: "กระจาย ERA ไม่เกิน 2–3x head size" },
    ],
    contra: ["Over epiphysis เด็ก", "Malignancy", "Thrombophlebitis", "Implanted metal (caution)", "Pregnancy"],
    note: "ใช้ pulsed สำหรับ acute / Coupling medium จำเป็นทุกครั้ง" },

  { modality: "IFC (Interferential)", icon: "〰️", indication: "Deep pain, edema, muscle re-education",
    params: [
      { label: "Carrier frequency", value: "4000 Hz (AMF)" },
      { label: "Beat frequency", value: "80–150 Hz (pain) / 1–10 Hz (motor/edema)" },
      { label: "Sweep", value: "0–100 Hz sweep สำหรับ prevent accommodation" },
      { label: "Intensity", value: "Strong tingling หรือ visible contraction" },
      { label: "Duration", value: "15–20 นาที" },
    ],
    contra: ["Pacemaker", "DVT", "Malignancy", "Pregnancy"],
    note: "เหมาะกับ deep tissue มากกว่า TENS เพราะ skin resistance น้อย" },

  { modality: "NMES / FES", icon: "💪", indication: "Muscle re-education, prevention of atrophy, spasticity",
    params: [
      { label: "Frequency", value: "20–50 Hz (tetanic)" },
      { label: "Pulse width", value: "200–400 µs" },
      { label: "On:Off ratio", value: "1:3 ถึง 1:5" },
      { label: "Ramp", value: "2 วินาที" },
      { label: "Intensity", result: "Visible muscle contraction" },
    ],
    contra: ["Recent fracture ไม่ stable", "Malignancy", "Pacemaker", "Epilepsy"],
    note: "FES ใช้ขณะทำ functional task เช่น gait ใน stroke" },

  { modality: "Hot Pack / Superficial Heat", icon: "🌡️", indication: "Chronic pain, muscle spasm, stiffness ก่อน stretch",
    params: [
      { label: "Temperature", value: "~70–75°C (pack), 40–45°C ที่ผิวหนัง" },
      { label: "Duration", value: "15–20 นาที" },
      { label: "Towel layers", value: "6–8 ชั้น (commercial pack)" },
    ],
    contra: ["Acute inflammation", "Impaired sensation", "Malignancy", "Open wound", "DVT"],
    note: "ใช้ก่อน exercise/stretch เพื่อเพิ่ม extensibility" },

  { modality: "Cryotherapy (Ice)", icon: "🧊", indication: "Acute injury, post-exercise soreness, edema",
    params: [
      { label: "Duration", value: "10–20 นาที" },
      { label: "Ice pack", value: "Towel 1 ชั้น คั่น" },
      { label: "Ice massage", value: "5–10 นาที จน numb" },
      { label: "RICE protocol", value: "Rest, Ice, Compression, Elevation" },
    ],
    contra: ["Raynaud's", "Cold urticaria", "Impaired sensation", "Open wound"],
    note: "PRICE ใน 48–72 ชม.แรก ลด inflammation" },
];

const DRUG_NOTES = [
  { drug: "NSAIDs (Ibuprofen, Diclofenac, Naproxen)", icon: "💊", category: "Analgesic/Anti-inflammatory",
    ptRelevance: [
      "ลด inflammation → อาจ mask pain → ระวัง overload",
      "GI side effect → ผู้ป่วยอาจไม่ comfortable ขณะ exercise",
      "Renal/cardiac risk ในผู้สูงอายุ",
    ],
    interaction: "ระวัง exercise intensity ขณะใช้ NSAIDs เพราะ pain masking",
    flag: "yellow" },

  { drug: "Corticosteroids (Prednisolone, Dexamethasone)", icon: "⚠️", category: "Anti-inflammatory",
    ptRelevance: [
      "Long-term use → osteoporosis, tendon fragility → ระวัง resistance exercise",
      "Proximal muscle weakness (steroid myopathy)",
      "Wound healing ช้า",
      "Blood glucose สูง → monitor ใน DM",
    ],
    interaction: "ปรับ exercise program เน้น low-load, protect joints",
    flag: "red" },

  { drug: "Anticoagulants (Warfarin, Heparin, Rivaroxaban)", icon: "🩸", category: "Anticoagulant",
    ptRelevance: [
      "ห้าม deep tissue massage, cupping, dry needling",
      "เสี่ยง bruising/bleeding จาก manual therapy",
      "ตรวจ INR ก่อน aggressive intervention",
    ],
    interaction: "งด manual therapy ที่รุนแรง / ใช้ gentle techniques เท่านั้น",
    flag: "red" },

  { drug: "Beta-blockers (Atenolol, Metoprolol, Propranolol)", icon: "❤️", category: "Cardiovascular",
    ptRelevance: [
      "HR ไม่สะท้อน exercise intensity → ใช้ Borg RPE แทน target HR",
      "อาจมี exercise intolerance",
      "Masking hypoglycemia symptoms",
    ],
    interaction: "ใช้ RPE 12–14 แทนการนับ HR สำหรับ exercise prescription",
    flag: "yellow" },

  { drug: "Diuretics (Furosemide, HCTZ)", icon: "💧", category: "Cardiovascular",
    ptRelevance: [
      "Electrolyte imbalance → muscle cramp, weakness",
      "Orthostatic hypotension → เสี่ยงหกล้มขณะลุกขึ้น",
      "Dehydration → monitor ขณะ exercise",
    ],
    interaction: "เฝ้าระวัง dizziness/fall ขณะ transfer และ mobility training",
    flag: "yellow" },

  { drug: "Muscle Relaxants (Baclofen, Tizanidine, Methocarbamol)", icon: "😴", category: "Muscle Relaxant",
    ptRelevance: [
      "Sedation → ระวัง balance / fall risk",
      "ลด muscle tone → อาจ affect functional exercise",
      "Timing: peak effect ~1–2 hr หลังกิน",
    ],
    interaction: "นัด PT ห่างจากเวลาทานยา หรือใช้ช่วง peak effect สำหรับ stretching",
    flag: "yellow" },

  { drug: "Bisphosphonates (Alendronate, Zoledronic acid)", icon: "🦴", category: "Bone",
    ptRelevance: [
      "ใช้ใน osteoporosis → เสี่ยง atypical femur fracture",
      "Osteonecrosis of jaw ถ้า dental procedure",
      "Exercise ยังแนะนำ (weight-bearing) แต่ระวัง impact",
    ],
    interaction: "Weight-bearing exercise ดี แต่งด high-impact activity",
    flag: "green" },
];

const SOAP_TEMPLATE = {
  S: {
    label: "Subjective",
    color: "#38bdf8",
    prompts: [
      "Chief complaint: ผู้ป่วยบ่นเรื่อง...",
      "Onset: เริ่มเป็นเมื่อ... (เฉียบพลัน/ค่อยเป็น)",
      "Mechanism: เกิดจาก...",
      "Pain: VAS _/10, ปวดที่... ร้าวไป...",
      "Aggravating factors: แย่ลงเมื่อ...",
      "Easing factors: ดีขึ้นเมื่อ...",
      "ADL limitation: ทำไม่ได้คือ...",
      "PMH/PSH/Medication: ...",
      "Goal ผู้ป่วย: ต้องการ...",
    ]
  },
  O: {
    label: "Objective",
    color: "#a78bfa",
    prompts: [
      "Observation: posture, gait, swelling, atrophy",
      "Vital signs: BP _/_ HR _ RR _ Temp _",
      "ROM: (กรอกค่าที่วัดได้)",
      "MMT: (กรอก grade แต่ละกล้าม)",
      "Special tests: (ผล + หรือ -)",
      "Sensation: intact / impaired (dermatome)",
      "Palpation: tenderness at... swelling... warmth...",
      "Functional test: TUG _ sec, 10MWT _ m/s",
      "Outcome measure: (Barthel/VAS/Berg score)",
    ]
  },
  A: {
    label: "Assessment",
    color: "#fbbf24",
    prompts: [
      "Diagnosis / Clinical impression: ...",
      "ICF: Body function impairment = ...",
      "Activity limitation = ...",
      "Participation restriction = ...",
      "Prognostic factors (positive/negative): ...",
      "Response to treatment: improved / no change / worse",
    ]
  },
  P: {
    label: "Plan",
    color: "#34d399",
    prompts: [
      "Short-term goal (2–4 สัปดาห์): ...",
      "Long-term goal (4–8 สัปดาห์): ...",
      "Treatment: modality + manual + exercise",
      "HEP (Home Exercise Program): ...",
      "Frequency: _x/week × _ weeks",
      "Referral/Consult: ...",
      "Education: แนะนำผู้ป่วยเรื่อง...",
      "Next review: ...",
    ]
  }
};

const ICF_DATA = {
  domains: [
    { domain: "Body Functions & Structure", icon: "🧬", color: "#38bdf8",
      description: "สภาพร่างกายและโครงสร้าง",
      examples: ["ROM limitation", "Muscle weakness (MMT)", "Pain (VAS)", "Edema", "Spasticity", "Sensory deficit"] },
    { domain: "Activity", icon: "🏃", color: "#a78bfa",
      description: "ความสามารถในการทำกิจกรรม",
      examples: ["Walking distance", "Stair climbing", "ADL (Barthel)", "Transfer", "Grip strength"] },
    { domain: "Participation", icon: "👥", color: "#34d399",
      description: "การมีส่วนร่วมในสังคม",
      examples: ["กลับไปทำงาน", "เล่นกีฬา", "ดูแลครอบครัว", "ขับรถ", "กิจกรรมสังคม"] },
    { domain: "Environmental Factors", icon: "🌍", color: "#fbbf24",
      description: "ปัจจัยสิ่งแวดล้อม (+ facilitator / - barrier)",
      examples: ["Social support +", "Ramp/wheelchair access +", "Stairs at home -", "Healthcare access +/-"] },
    { domain: "Personal Factors", icon: "🧑", color: "#f97316",
      description: "Personal Factors",
      examples: ["Age", "Motivation", "Education", "Co-morbidity", "Coping style", "Cultural beliefs"] },
  ]
};

// ─────────────────────────────────────────────
// EXTRA DATA
// ─────────────────────────────────────────────
const DIFF_DX = [
  { symptom:"ปวดไหล่ยกแขนไม่ขึ้น", conditions:[
    {name:"Subacromial Impingement",prob:"สูง",clue:"Painful arc 70–120°, Neer/Hawkins +"},
    {name:"Rotator Cuff Tear",prob:"สูง",clue:"Drop arm +, weakness ER/Abd"},
    {name:"Frozen Shoulder",prob:"ปานกลาง",clue:"Global ROM loss, capsular pattern"},
    {name:"AC Joint sprain",prob:"ต่ำ",clue:"เจ็บ AC joint โดยตรง, cross arm +"},
  ]},
  { symptom:"ปวดคอร้าวลงแขน", conditions:[
    {name:"Cervical Radiculopathy",prob:"สูง",clue:"Spurling +, dermatomal pattern"},
    {name:"TOS (Thoracic Outlet)",prob:"ปานกลาง",clue:"ULNT +, vascular signs"},
    {name:"Shoulder referred pain",prob:"ต่ำ",clue:"No neuro signs, shoulder pathology"},
  ]},
  { symptom:"ปวดหลังล่างร้าวลงขา", conditions:[
    {name:"Disc Herniation L4–S1",prob:"สูง",clue:"SLR +, dermatomal leg pain"},
    {name:"Lumbar Stenosis",prob:"สูง",clue:"Neurogenic claudication, bilateral"},
    {name:"Piriformis Syndrome",prob:"ปานกลาง",clue:"FADIR +, SLR ±, buttock pain"},
    {name:"SI Joint pain",prob:"ปานกลาง",clue:"FABER/FADIR +, no radiculopathy"},
  ]},
  { symptom:"ปวดเข่า", conditions:[
    {name:"Knee OA",prob:"สูง (ผู้สูงอายุ)",clue:"Crepitus, morning stiffness, bony change"},
    {name:"Meniscus Tear",prob:"สูง",clue:"McMurray/Thessaly +, joint line tender"},
    {name:"ACL Injury",prob:"ปานกลาง",clue:"Pop+swelling, Lachman +, giving way"},
    {name:"Patellofemoral Pain",prob:"ปานกลาง",clue:"Ant knee pain, worse stairs/squat"},
    {name:"Pes Anserine Bursitis",prob:"ต่ำ",clue:"Medial proximal tibia tender"},
  ]},
  { symptom:"ปวดส้นเท้า", conditions:[
    {name:"Plantar Fasciitis",prob:"สูง",clue:"First step pain, Windlass +, medial heel"},
    {name:"Achilles Tendinopathy",prob:"สูง",clue:"Posterior heel pain, worse activity"},
    {name:"Heel Fat Pad Syndrome",prob:"ปานกลาง",clue:"Central heel pain, diffuse tender"},
    {name:"Tarsal Tunnel Syndrome",prob:"ต่ำ",clue:"Tinel behind medial malleolus +"},
  ]},
  { symptom:"ปวดชาข้อมือ-นิ้วมือ", conditions:[
    {name:"Carpal Tunnel Syndrome",prob:"สูง",clue:"Phalen/Tinel +, median distribution"},
    {name:"Cubital Tunnel (Ulnar)",prob:"ปานกลาง",clue:"Ring/little finger, Tinel elbow +"},
    {name:"de Quervain's",prob:"ปานกลาง",clue:"Radial wrist pain, Finkelstein +"},
    {name:"C6/C7 Radiculopathy",prob:"ปานกลาง",clue:"Neck pain, ULNT +, dermatomal"},
  ]},
  { symptom:"ปวดสะโพก-ขาหนีบ", conditions:[
    {name:"Hip OA",prob:"สูง",clue:"Capsular pattern IR>Flex>Abd, age >50"},
    {name:"FAI",prob:"สูง",clue:"FADIR +, young active, groin pain"},
    {name:"Labral Tear",prob:"ปานกลาง",clue:"Click/catch, FADIR +, MRI confirm"},
    {name:"Greater Trochanteric Bursitis",prob:"ปานกลาง",clue:"Lateral hip tender, FABER pain"},
  ]},
];

const EXERCISE_RX = [
  { condition:"Frozen Shoulder", icon:"❄️", phases:[
    { phase:"Freezing (acute)", focus:"Pain control, gentle ROM", exercises:[
      "Pendulum exercise (Codman) — 2×10 rep ทุกทิศ",
      "AROM ใต้ pain threshold เท่านั้น",
      "Scapular setting — 3×10",
      "Heat ก่อน + Ice หลัง exercise",
    ]},
    { phase:"Frozen (adhesive)", focus:"Restore ROM, capsular stretch", exercises:[
      "Passive/active-assisted ROM ทุกทิศทาง",
      "Inferior/posterior capsule stretch — hold 30 วิ ×3",
      "Pulleys + wall walking",
      "Horizontal adduction stretch (sleeper stretch)",
      "Mobilization Grade III–IV",
    ]},
    { phase:"Thawing (resolving)", focus:"Strengthen, functional return", exercises:[
      "Theraband ER/IR — 3×15",
      "Rotator cuff strengthening",
      "Scapular stabilization",
      "Functional reaching tasks",
    ]},
  ]},
  { condition:"Knee OA", icon:"🦴", phases:[
    { phase:"Acute flare", focus:"Pain/swelling control", exercises:[
      "Quad sets — 3×10 hold 5 วิ",
      "SLR — 3×10",
      "Ankle pumps",
      "Ice 15–20 นาที หลัง exercise",
    ]},
    { phase:"Subacute", focus:"Strength, ROM, proprioception", exercises:[
      "Short arc quad — 3×15",
      "Mini squat 0–40° — 3×15",
      "Step up ต่ำ 4–6 นิ้ว — 3×10",
      "Standing balance — 30 วิ ×3",
      "Stationary bike low resistance",
    ]},
    { phase:"Chronic/maintenance", focus:"Function, ADL, weight management", exercises:[
      "Wall squat — 3×15",
      "Leg press — 3×15",
      "Walking program เพิ่มทีละ 10%/สัปดาห์",
      "Swimming / Aquatherapy",
      "Balance board",
    ]},
  ]},
  { condition:"LBP / Disc Herniation", icon:"🔴", phases:[
    { phase:"Acute (0–2 wk)", focus:"Pain relief, centralization", exercises:[
      "McKenzie extension in lying — 10 rep q2h",
      "Prone lying 5–10 นาที",
      "Knee to chest stretch เบาๆ",
      "งดก้มหยิบของ / นั่งนาน",
    ]},
    { phase:"Subacute (2–6 wk)", focus:"Stabilization, posture", exercises:[
      "Abdominal bracing — 3×10 hold 10 วิ",
      "Bird-dog — 3×10 แต่ละข้าง",
      "Dead bug — 3×10",
      "Bridging — 3×15",
      "Walking 20–30 นาที",
    ]},
    { phase:"Chronic (>6 wk)", focus:"Load capacity, return to function", exercises:[
      "McGill Big 3: curl-up, side plank, bird-dog",
      "Romanian deadlift เบาๆ",
      "Squat progression",
      "Aerobic exercise 150 นาที/สัปดาห์",
    ]},
  ]},
  { condition:"Rotator Cuff Tear (non-op)", icon:"💥", phases:[
    { phase:"Acute (0–4 wk)", focus:"Protect, pain control", exercises:[
      "Pendulum — 2×10",
      "Elbow/wrist ROM",
      "Scapular retraction — 3×10",
      "งด overhead / lifting",
    ]},
    { phase:"Subacute (4–8 wk)", focus:"Passive → active ROM", exercises:[
      "PROM ทุกทิศทาง → AAROM → AROM",
      "ER side-lying theraband — 3×15",
      "Side-lying IR — 3×15",
      "Scapular PNF",
    ]},
    { phase:"Strengthening (8–12 wk)", focus:"Strength, function", exercises:[
      "Full can — 3×15 light resistance",
      "Rows — 3×15",
      "Theraband diagonal patterns",
      "Closed-chain wall push-up",
    ]},
  ]},
  { condition:"ACL Rehab (post-op)", icon:"⚡", phases:[
    { phase:"Phase 1 (wk 0–2)", focus:"Swelling, ROM 0–90°, quad activation", exercises:[
      "Quad sets — 3×10",
      "SLR — 3×10",
      "Heel slides — passive ROM",
      "Calf pumps",
      "Patella mobilization",
    ]},
    { phase:"Phase 2 (wk 2–6)", focus:"ROM full, closed-chain", exercises:[
      "Mini squat → squat 0–60°",
      "Leg press 0–60°",
      "Step up/down",
      "Stationary bike",
      "Balance/proprioception board",
    ]},
    { phase:"Phase 3 (wk 6–12)", focus:"Strength, jogging prep", exercises:[
      "Squat full ROM — 3×15",
      "Lunges",
      "Lateral band walks",
      "Single leg press",
      "Jogging program (criteria-based)",
    ]},
  ]},
];

const GAIT_DATA = {
  phases:[
    {name:"Initial Contact",thai:"ส้นเท้าแตะพื้น",percent:"0%",joints:[
      {j:"Hip",val:"Flex 30°"},{j:"Knee",val:"Ext 0°"},{j:"Ankle",val:"DF 0°"},
    ]},
    {name:"Loading Response",thai:"รับน้ำหนัก",percent:"0–12%",joints:[
      {j:"Hip",val:"Flex 30°"},{j:"Knee",val:"Flex 15°"},{j:"Ankle",val:"PF 15°"},
    ]},
    {name:"Mid Stance",thai:"กลางเฟสยืน",percent:"12–31%",joints:[
      {j:"Hip",val:"Ext 0°"},{j:"Knee",val:"Flex 5°"},{j:"Ankle",val:"DF 10°"},
    ]},
    {name:"Terminal Stance",thai:"ปลายเฟสยืน",percent:"31–50%",joints:[
      {j:"Hip",val:"Ext 10°"},{j:"Knee",val:"Ext 0°"},{j:"Ankle",val:"DF 15°"},
    ]},
    {name:"Pre-Swing",thai:"เตรียมก้าว",percent:"50–62%",joints:[
      {j:"Hip",val:"Flex 0°"},{j:"Knee",val:"Flex 40°"},{j:"Ankle",val:"PF 20°"},
    ]},
    {name:"Initial Swing",thai:"เริ่มแกว่งขา",percent:"62–75%",joints:[
      {j:"Hip",val:"Flex 20°"},{j:"Knee",val:"Flex 60°"},{j:"Ankle",val:"DF 5°"},
    ]},
    {name:"Mid Swing",thai:"กลางแกว่งขา",percent:"75–87%",joints:[
      {j:"Hip",val:"Flex 30°"},{j:"Knee",val:"Flex 30°"},{j:"Ankle",val:"DF 0°"},
    ]},
    {name:"Terminal Swing",thai:"ปลายแกว่งขา",percent:"87–100%",joints:[
      {j:"Hip",val:"Flex 30°"},{j:"Knee",val:"Ext 0°"},{j:"Ankle",val:"DF 0°"},
    ]},
  ],
  deviations:[
    {deviation:"Trendelenburg gait",cause:"Gluteus medius weakness",plane:"Frontal",fix:"Hip abd strengthening"},
    {deviation:"Antalgic gait",cause:"Pain — shortened stance phase",plane:"Sagittal",fix:"Treat underlying cause"},
    {deviation:"Steppage gait",cause:"Dorsiflexor weakness (foot drop)",plane:"Sagittal",fix:"AFO, TA strengthening, NMES"},
    {deviation:"Scissor gait",cause:"Hip adductor spasticity",plane:"Frontal",fix:"Spasticity management, hip abd stretch"},
    {deviation:"Circumduction",cause:"Weak hip flex / stiff knee",plane:"Frontal",fix:"Hip flex/knee ROM training"},
    {deviation:"Vaulting",cause:"Swing phase clearance problem",plane:"Sagittal",fix:"Ankle PF control, prosthetic adjustment"},
    {deviation:"Lateral trunk lean",cause:"Hip pain / gluteus med weakness",plane:"Frontal",fix:"Hip strengthening, pain control"},
    {deviation:"Recurvatum (knee hyperext)",cause:"Quad weakness / PF spasticity",plane:"Sagittal",fix:"Knee control training, orthosis"},
  ],
};

const MUSCLE_LENGTH_TESTS = [
  { name:"Thomas Test", muscle:"Hip Flexors (Iliopsoas)", icon:"🦵",
    position:"นอนหงาย ชิดขอบเตียง ดึงเข่าข้างหนึ่งเข้าหาอก",
    positive:"ขาอีกข้างยกขึ้นจากเตียง = hip flexor tightness",
    normal:"ขาอยู่ราบบนเตียง hip neutral",
    grading:"บันทึกองศา hip flex ที่เกิดขึ้น" },
  { name:"Modified Ober's Test", muscle:"IT Band / TFL", icon:"📐",
    position:"นอนตะแคง เข่างอ 90° ผู้ตรวจจับขาค้างไว้แล้วปล่อย",
    positive:"ขาค้างอยู่ในอากาศ ไม่ตกลง = IT band tightness",
    normal:"ขาตกลงมา adduction ได้ >0°",
    grading:"วัดองศา hip adduction ที่เกิดขึ้น" },
  { name:"Ely's Test", muscle:"Rectus Femoris", icon:"🏃",
    position:"นอนคว่ำ งอเข่า passive ขึ้น",
    positive:"สะโพกยกขึ้นจากเตียงอัตโนมัติ = rectus femoris tightness",
    normal:"งอเข่าได้ >120° โดยไม่มี hip flex",
    grading:"บันทึกองศา knee flex ที่ hip เริ่มยก" },
  { name:"90-90 Hamstring Test", muscle:"Hamstrings", icon:"🦵",
    position:"นอนหงาย hip+knee 90° เหยียดเข่าขึ้น",
    positive:"เหยียดเข่าได้ไม่ถึง 20° จาก full ext = tight hamstring",
    normal:"เหยียดเข่าได้ popliteal angle ≤20°",
    grading:"Popliteal angle (วัดจาก full ext = 0°)" },
  { name:"Gastroc-Soleus Length Test", muscle:"Gastrocnemius / Soleus", icon:"🦶",
    position:"นอนหงาย / นั่ง เข่าเหยียด (gastroc) และงอ (soleus) dorsiflexion passive",
    positive:"DF <10° เข่าเหยียด = gastroc tight; <10° เข่างอ = soleus tight",
    normal:"Dorsiflexion ≥10° ในทั้งสองท่า",
    grading:"วัดองศา DF ในแต่ละท่า" },
  { name:"Finkelstein Test", muscle:"APL / EPB (de Quervain's)", icon:"✋",
    position:"กำมือโดยเอานิ้วโป้งไว้ใน fist แล้ว ulnar deviate ข้อมือ",
    positive:"เจ็บแปลบที่ radial styloid = de Quervain's positive",
    normal:"ไม่เจ็บหรือเจ็บเล็กน้อย",
    grading:"บันทึก VAS ความเจ็บปวด" },
  { name:"Neck Flexor Endurance Test", muscle:"Deep neck flexors", icon:"🔄",
    position:"นอนหงาย ยก head 2.5 cm ค้างไว้",
    positive:"ค้างไม่ได้นาน / หัวตก = deep neck flexor weakness",
    normal:"ค้างได้ ≥39 วิ (ชาย) / ≥29 วิ (หญิง)",
    grading:"บันทึกเวลา (วินาที)" },
  { name:"Pectoralis Minor Length Test", muscle:"Pectoralis Minor", icon:"💪",
    position:"นอนหงาย วัดระยะ posterior shoulder จากเตียง",
    positive:">2.5 cm = pec minor tightness",
    normal:"Posterior shoulder แตะเตียง / <2.5 cm",
    grading:"วัดระยะเป็น cm" },
];

const POSTURE_CHECKLIST = {
  views:[
    { view:"Anterior", items:[
      {area:"Head",normal:"Midline, level eyes/ears",deviation:"Lateral tilt, rotation"},
      {area:"Shoulders",normal:"Level, equal height",deviation:"Elevation ข้างใดข้างหนึ่ง, rounding"},
      {area:"ASIS",normal:"Level ทั้งสองข้าง",deviation:"Pelvic tilt lateral"},
      {area:"Patella",normal:"Facing forward",deviation:"Squinting / grasshopper eyes"},
      {area:"Foot",normal:"Slight toeing out 5–10°",deviation:"Excessive toe in/out, pes planus/cavus"},
    ]},
    { view:"มุมหลัง (Posterior)", items:[
      {area:"Head",normal:"Midline",deviation:"Lateral shift"},
      {area:"Spine",normal:"Straight midline",deviation:"Scoliosis (C/S curve)"},
      {area:"Scapula",normal:"Symmetric, flat on thorax",deviation:"Winging, unequal height"},
      {area:"PSIS",normal:"Level ทั้งสองข้าง",deviation:"Unleveled — pelvic obliquity"},
      {area:"Popliteal crease",normal:"Level ทั้งสองข้าง",deviation:"Unequal — leg length diff"},
      {area:"Calcaneus",normal:"Vertical",deviation:"Valgus / Varus"},
    ]},
    { view:"มุมข้าง (Lateral)", items:[
      {area:"Ear lobe",normal:"Over shoulder, hip, ankle",deviation:"Forward head posture"},
      {area:"Cervical",normal:"Lordosis ปกติ",deviation:"Hyperlordosis / Flat neck"},
      {area:"Thoracic",normal:"Kyphosis ปกติ 20–45°",deviation:"Hyperkyphosis (>45°) / Flat"},
      {area:"Lumbar",normal:"Lordosis ปกติ",deviation:"Hyperlordosis / Flat back"},
      {area:"Knee",normal:"Slight flex 0–5°",deviation:"Hyperextension / Flexed"},
      {area:"Ankle",normal:"Neutral",deviation:"Dorsiflexed / Plantarflexed"},
    ]},
  ],
};

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────
const TABS = [
  { id: "rom",        label: "ROM",        icon: "📐" },
  { id: "conditions", label: "โรค & Tests", icon: "🏥" },
  { id: "dermatome",  label: "Neuro",      icon: "🧠" },
  { id: "mmt",        label: "MMT",        icon: "💪" },
  { id: "outcomes",   label: "Scales",     icon: "📊" },
  { id: "redflags",   label: "Red Flags",  icon: "🚨" },
  { id: "electro",    label: "Electro",    icon: "⚡" },
  { id: "drugs",      label: "Drugs",      icon: "💊" },
  { id: "soap",       label: "SOAP",       icon: "📋" },
  { id: "calc",       label: "Calculator", icon: "🧮" },
  { id: "diffdx",     label: "Diff Dx",    icon: "🔎" },
  { id: "timer",      label: "Timer",      icon: "⏱️" },
];

const COND_CATS = ["ทั้งหมด","ไหล่","ศอก","เข่า","เท้า","คอ","หลัง","มือ","สะโพก"];
const BODY_REGIONS = [
  { label:"ทั้งหมด", icon:"🔍" },
  { label:"ไหล่",    icon:"🦾" },
  { label:"ศอก",     icon:"💪" },
  { label:"มือ/ข้อมือ", icon:"✋" },
  { label:"หลัง",   icon:"🦴" },
  { label:"คอ",     icon:"🔄" },
  { label:"สะโพก",  icon:"🔵" },
  { label:"เข่า",   icon:"🦿" },
  { label:"เท้า",   icon:"🦶" },
];
const REGION_MAP = {
  "Upper": ["ไหล่","ศอก","มือ"],
  "Spine": ["คอ","หลัง"],
  "Lower": ["เข่า","เท้า","สะโพก"],
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function PTApp() {
  const [activeTab, setActiveTab] = useState("rom");
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedElectro, setSelectedElectro] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [condCat, setCondCat] = useState("ทั้งหมด");
  const [condSearch, setCondSearch] = useState("");
  const [soapSection, setSoapSection] = useState("S");
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery2, setSearchQuery2] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [calcTab, setCalcTab] = useState("bmi");
  const [calcInputs, setCalcInputs] = useState({});
  const [calcResult, setCalcResult] = useState(null);
  const [gaitView, setGaitView] = useState("phases");
  const [diffSymptom, setDiffSymptom] = useState(null);
  const [exCondition, setExCondition] = useState(null);
  const [postureView, setPostureView] = useState("Anterior");
  const [soapNotes, setSoapNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pt-soap-notes") || "{}"); } catch { return {}; }
  });
  const [soapPatient, setSoapPatient] = useState("");
  const [bodyRegion, setBodyRegion] = useState("ทั้งหมด");

  useEffect(() => { setMounted(true); }, []);

  const switchTab = (id) => {
    setActiveTab(id);
    setSelectedJoint(null); setSelectedCondition(null);
    setSelectedOutcome(null); setSelectedElectro(null); setSelectedDrug(null);
  };

  const filteredConds = CONDITIONS_DATA.filter(cx => {
    const regionCats = bodyRegion === "ทั้งหมด" ? null : REGION_MAP[bodyRegion];
    const mr = !regionCats || regionCats.includes(cx.category);
    const mc = condCat === "ทั้งหมด" || cx.category === condCat;
    const ms = !condSearch || cx.name.toLowerCase().includes(condSearch.toLowerCase()) || cx.thai.includes(condSearch);
    return mr && mc && ms;
  });

  const toggleFavorite = (id) => setFavorites(f => f.includes(id) ? f.filter(x=>x!==id) : [...f, id]);
  const isFav = (id) => favorites.includes(id);
  const [lastSaved, setLastSaved] = useState(null);
  const saveSoapNote = (key, val) => {
    const updated = { ...soapNotes, [`${soapPatient||"draft"}_${key}`]: val };
    setSoapNotes(updated);
    setLastSaved(key);
    setTimeout(() => setLastSaved(null), 1500);
    try { localStorage.setItem("pt-soap-notes", JSON.stringify(updated)); } catch {}
  };
  const getNote = (key) => soapNotes[`${soapPatient||"draft"}_${key}`] || "";
  const T = darkMode ? {
    bg:     "linear-gradient(160deg,#0b1520 0%,#0f1e2e 60%,#0b1520 100%)",
    surface:"rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.07)",
    header: "rgba(11,21,32,0.95)",
    hborder:"rgba(56,189,248,0.12)",
    text:   "#e2eaf3",
    sub:    "#64748b",
    muted:  "#475569",
    card:   "rgba(255,255,255,0.04)",
    input:  "rgba(255,255,255,0.04)",
    inputBorder:"rgba(56,189,248,0.18)",
    searchBg:"#0f1e2e",
  } : {
    bg:     "linear-gradient(160deg,#f0f9ff 0%,#e0f2fe 60%,#f0f9ff 100%)",
    surface:"rgba(255,255,255,0.85)",
    border: "rgba(14,165,233,0.15)",
    header: "rgba(240,249,255,0.97)",
    hborder:"rgba(14,165,233,0.2)",
    text:   "#0f172a",
    sub:    "#475569",
    muted:  "#64748b",
    card:   "rgba(255,255,255,0.9)",
    input:  "rgba(255,255,255,0.9)",
    inputBorder:"rgba(14,165,233,0.35)",
    searchBg:"#fff",
  };
  const C = { blue: "#0ea5e9", purple: "#7c3aed", gold: "#d97706", green: "#16a34a", orange: "#ea580c", red: "#dc2626" };
  const Cm = darkMode ? C : { blue:"#0369a1", purple:"#6d28d9", gold:"#b45309", green:"#15803d", orange:"#c2410c", red:"#b91c1c" };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Sarabun','Noto Sans Thai',sans-serif", color:T.text, overflowX:"hidden" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.3);border-radius:2px}
        input::placeholder{color:#94a3b8} textarea::placeholder{color:#94a3b8}
        input, textarea, select { color-scheme: ${darkMode ? "dark" : "light"}; }
      `}</style>

      {/* BG grid */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:darkMode?"radial-gradient(circle at 1px 1px,rgba(56,189,248,0.05) 1px,transparent 0)":"radial-gradient(circle at 1px 1px,rgba(14,165,233,0.08) 1px,transparent 0)", backgroundSize:"40px 40px" }} />

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:50, background:T.header, backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.hborder}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"12px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#0ea5e9,#38bdf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 16px rgba(56,189,248,0.35)", flexShrink:0 }}>🦴</div>
            <div style={{ flex:1 }}>
              <h1 style={{ margin:0, fontSize:16, fontWeight:800, background: darkMode ? "linear-gradient(90deg,#38bdf8,#7dd3fc)" : "none", WebkitBackgroundClip: darkMode ? "text" : "unset", WebkitTextFillColor: darkMode ? "transparent" : "#0369a1" }}>PT Pocket Guide</h1>
              <p style={{ margin:0, fontSize:10, color:"#475569", letterSpacing:"0.08em" }}>
                {selectedCondition ? `โรค › ${selectedCondition.name}` :
                 selectedJoint ? `ROM › ${selectedJoint.joint}` :
                 selectedOutcome ? `Scales › ${selectedOutcome.name}` :
                 selectedElectro ? `Electro › ${selectedElectro.modality}` :
                 selectedDrug ? `Drugs › ${selectedDrug.drug.split(" ")[0]}` :
                 "PHYSICAL THERAPY REFERENCE"}
              </p>
            </div>
          </div>
          {/* Breadcrumb + Toolbar */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <div style={{ flex:1, fontSize:11, color:"#38bdf8", fontWeight:700, opacity:0.7 }}>
              {TABS.find(t=>t.id===activeTab)?.icon} {TABS.find(t=>t.id===activeTab)?.label}
              {selectedCondition && ` › ${selectedCondition.name}`}
              {selectedJoint && ` › ${selectedJoint.joint}`}
              {selectedOutcome && ` › ${selectedOutcome.name}`}
            </div>
            <div style={{ flex:1, position:"relative" }}>
              {showSearch && <input autoFocus value={searchQuery2} onChange={e=>setSearchQuery2(e.target.value)}
                placeholder="Global search: SLR, Knee OA, TENS..."
                style={{ width:"100%", padding:"7px 12px 7px 32px", borderRadius:9, border:"1px solid rgba(56,189,248,0.25)", background:"rgba(255,255,255,0.06)", color:"#e2eaf3", fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />}
              {showSearch && <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12 }}>🔍</span>}
            </div>
            <button onClick={()=>{setShowSearch(s=>!s); setSearchQuery2("");}}
              style={{ padding:"6px 10px", borderRadius:8, border:"1px solid rgba(56,189,248,0.2)", background: showSearch?"rgba(56,189,248,0.15)":"transparent", color:showSearch?"#38bdf8":"#475569", cursor:"pointer", fontSize:14 }}>🔍</button>
            <button onClick={()=>setDarkMode(d=>!d)}
              style={{ padding:"6px 10px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:14 }}>{darkMode?"☀️":"🌙"}</button>
            {favorites.length>0 && <button onClick={()=>switchTab("fav")}
              style={{ padding:"6px 10px", borderRadius:8, border:"1px solid rgba(251,191,36,0.3)", background:"rgba(251,191,36,0.1)", color:"#fbbf24", cursor:"pointer", fontSize:14 }}>⭐{favorites.length}</button>}
          </div>
          {/* Scrollable tabs */}
          <div style={{ display:"flex", gap:2, overflowX:"auto", paddingBottom:1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => switchTab(t.id)} style={{ flexShrink:0, padding:"9px 10px", border:"none", cursor:"pointer", borderRadius:"8px 8px 0 0", fontSize:11, fontWeight:700, fontFamily:"inherit", transition:"all 0.2s", background: activeTab===t.id ? "rgba(56,189,248,0.15)" : "transparent", color: activeTab===t.id ? "#38bdf8" : "#475569", borderBottom: activeTab===t.id ? "2px solid #38bdf8" : "2px solid transparent" }}>
                <span style={{ display:"block", fontSize:15, marginBottom:2 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      {/* Offline banner */}
      {mounted && !navigator.onLine && (
        <div style={{ background:"rgba(245,158,11,0.15)", borderBottom:"1px solid rgba(245,158,11,0.3)", padding:"6px 16px", fontSize:11, color:"#fbbf24", textAlign:"center" }}>
          ⚡ Offline mode — ข้อมูลทั้งหมดพร้อมใช้งาน · AI diagrams ไม่พร้อมใช้
        </div>
      )}
      <main style={{ maxWidth:900, margin:"0 auto", padding:"18px 14px 100px", position:"relative", zIndex:1, opacity: mounted?1:0, transition:"opacity 0.3s" }}>

        {/* ══════════ ROM ══════════ */}
        {activeTab==="rom" && !selectedJoint && (
          <>
            <ST title="Range of Motion" sub="Normal & Functional ROM reference" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 }}>
              {ROM_DATA.map((j,i) => (
                <Card key={i} onClick={() => setSelectedJoint(j)} delay={i*40} style={{ cursor:"pointer", textAlign:"center", padding:"18px 10px" }}>
                  <div style={{ fontSize:30, marginBottom:6 }}>{j.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13 }}>{j.joint}</div>
                  <div style={{ fontSize:10, color:C.blue, marginTop:4 }}>{j.motions.length} planes</div>
                </Card>
              ))}
            </div>
          </>
        )}
        {activeTab==="rom" && selectedJoint && (
          <>
            <Back onClick={() => setSelectedJoint(null)} />
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <span style={{ fontSize:34 }}>{selectedJoint.icon}</span>
              <div><h2 style={{ margin:0, fontSize:19, fontWeight:800 }}>{selectedJoint.joint}</h2><p style={{ margin:0, fontSize:11, color:"#475569" }}>Range of Motion Reference</p></div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 5px" }}>
                <thead><tr>{["Movement","Normal ROM","Functional ROM"].map(h=><th key={h} style={{ padding:"6px 12px", textAlign:"left", fontSize:10, color:C.blue, letterSpacing:"0.1em", fontWeight:800 }}>{h}</th>)}</tr></thead>
                <tbody>{selectedJoint.motions.map((m,i) => (
                  <tr key={i}>
                    <td style={{ padding:"11px 12px", background:"rgba(255,255,255,0.04)", borderRadius:"9px 0 0 9px", fontWeight:600, fontSize:15 }}>{m.name}</td>
                    <td style={{ padding:"11px 12px", background:"rgba(255,255,255,0.04)", color:C.blue, fontWeight:700, fontSize:15 }}>{m.normal}</td>
                    <td style={{ padding:"11px 12px", background:"rgba(255,255,255,0.04)", borderRadius:"0 9px 9px 0", color:m.functional==="-"?"#334155":C.gold, fontSize:13 }}>{m.functional}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ marginTop:14, padding:12, borderRadius:10, background:"rgba(56,189,248,0.07)", border:"1px solid rgba(56,189,248,0.14)", fontSize:11, color:"#64748b" }}>
              🔵 <b style={{ color:C.blue }}>Normal ROM</b> = ค่าอ้างอิงปกติ &nbsp;|&nbsp; 🟡 <b style={{ color:C.gold }}>Functional ROM</b> = ขั้นต่ำสำหรับ ADL
            </div>
          </>
        )}

        {/* ══════════ CONDITIONS ══════════ */}
        {activeTab==="conditions" && !selectedCondition && (
          <>
            <ST title="Conditions & Special Tests" sub="Clinical signs & examination" />
            {/* Search bar */}
            <div style={{ position:"relative", marginBottom:10 }}>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
              <input value={condSearch} onChange={e => { setCondSearch(e.target.value); setBodyRegion("ทั้งหมด"); setCondCat("ทั้งหมด"); }}
                placeholder="Search conditions, tests..."
                style={{ width:"100%", padding:"12px 14px 12px 40px", borderRadius:12, border:"1px solid rgba(56,189,248,0.18)", background:T.input, color:T.text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
            {/* Body region quick filter */}
            <div style={{ display:"flex", gap:6, marginBottom:8 }}>
              {["ทั้งหมด","Upper","Spine","Lower"].map(r => (
                <button key={r} onClick={() => { setBodyRegion(r); setCondCat("ทั้งหมด"); }}
                  style={{ flex:1, padding:"8px 4px", borderRadius:10, border:"1px solid", borderColor:bodyRegion===r?"#38bdf8":"rgba(255,255,255,0.08)", background:bodyRegion===r?"rgba(56,189,248,0.16)":"rgba(255,255,255,0.03)", color:bodyRegion===r?"#38bdf8":"#64748b", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                  {r==="ทั้งหมด"?"All":r==="Upper"?"🦾 Upper":r==="Spine"?"🦴 Spine":"🦵 Lower"}
                </button>
              ))}
            </div>
            {/* Sub-category chips */}
            <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
              {(bodyRegion==="ทั้งหมด" ? COND_CATS : ["ทั้งหมด",...(REGION_MAP[bodyRegion]||[])]).map(cat => (
                <button key={cat} onClick={() => setCondCat(cat)}
                  style={{ padding:"5px 12px", borderRadius:20, border:"1px solid", borderColor:condCat===cat?"#38bdf8":"rgba(255,255,255,0.08)", background:condCat===cat?"rgba(56,189,248,0.14)":"transparent", color:condCat===cat?"#38bdf8":"#64748b", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", fontWeight:700 }}>{cat}</button>
              ))}
            </div>
            {/* Results count */}
            <div style={{ fontSize:11, color:"#475569", marginBottom:10 }}>{filteredConds.length} conditions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filteredConds.map((cx,i) => (
                <Card key={i} onClick={() => setSelectedCondition(cx)} delay={i*20} style={{ cursor:"pointer", padding:"13px 15px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <span style={{ fontSize:28, flexShrink:0 }}>{cx.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15 }}>{cx.name}</div>
                      <div style={{ fontSize:12, color:"#7dd3fc", marginTop:1, fontWeight:600 }}>{cx.thai}</div>
                      <div style={{ fontSize:10, color:C.blue, marginTop:4 }}>🔬 {cx.tests.length} special tests · {cx.category}</div>
                    </div>
                    <span style={{ color:C.blue, fontSize:18 }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {activeTab==="conditions" && selectedCondition && (
          <ConditionDetail
            condition={selectedCondition}
            onBack={() => setSelectedCondition(null)}
            C={C}
          />
        )}

        {/* ══════════ DERMATOME ══════════ */}
        {activeTab==="dermatome" && (
          <>
            <ST title="Dermatome & Myotome" sub="Nerve root reference C5–S1" />
            <Card style={{ marginBottom:14, padding:14, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)" }}>
              <div style={{ fontSize:12, color:"#fca5a5", fontWeight:700, marginBottom:6 }}>🔴 UMN vs LMN Quick Clue</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[["UMN (Central)","Spasticity, hyperreflexia, Babinski +, clonus, weakness"],["LMN (Peripheral)","Flaccidity, hyporeflexia, fasciculation, atrophy, weakness"]].map(([t,d],i) => (
                  <div key={i} style={{ fontSize:11 }}><div style={{ fontWeight:700, color:"#fca5a5", marginBottom:3 }}>{t}</div><div style={{ color:"#94a3b8", lineHeight:1.6 }}>{d}</div></div>
                ))}
              </div>
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {DERMATOME_DATA.map((d,i) => (
                <Card key={i} delay={i*25} style={{ padding:"13px 15px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                    <div style={{ minWidth:46, height:46, borderRadius:11, background:"linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.08))", border:"1px solid rgba(56,189,248,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:C.blue }}>{d.level}</div>
                    <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"3px 10px" }}>
                      {[["Motor",C.blue,d.motor],["Sensory",C.gold,d.sensory],["Reflex",C.purple,d.reflex]].map(([l,c,v]) => (
                        <div key={l}><div style={{ fontSize:9, color:c, marginBottom:2, fontWeight:800 }}>{l}</div><div style={{ fontSize:11, color:v==="-"?"#334155":"#e2eaf3" }}>{v}</div></div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ── Gait Analysis (embedded in Neuro) ── */}
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:13, fontWeight:800, color:C.blue, marginBottom:10, letterSpacing:"0.04em" }}>🚶 GAIT ANALYSIS</div>
              <div style={{ display:"flex", gap:5, marginBottom:12 }}>
                {["phases","deviations"].map(v=>(
                  <button key={v} onClick={()=>setGaitView(v)} style={{ flex:1, padding:"8px", borderRadius:9, border:"1px solid", borderColor:gaitView===v?"#38bdf8":"rgba(255,255,255,0.1)", background:gaitView===v?"rgba(56,189,248,0.14)":"transparent", color:gaitView===v?"#38bdf8":"#64748b", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>{v==="phases"?"Gait Phases":"Deviations"}</button>
                ))}
              </div>
              {gaitView==="phases" && GAIT_DATA.phases.map((ph,i)=>(
                <Card key={i} delay={i*20} style={{ padding:"12px 14px", marginBottom:7 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:6 }}>
                    <div style={{ minWidth:38, fontSize:9, color:"#64748b", textAlign:"center", lineHeight:1.3 }}>{ph.percent}</div>
                    <div><div style={{ fontWeight:700, fontSize:12 }}>{ph.name}</div><div style={{ fontSize:10, color:"#64748b" }}>{ph.thai}</div></div>
                  </div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", paddingLeft:50 }}>
                    {ph.joints.map((j,k)=>(
                      <div key={k} style={{ padding:"3px 9px", borderRadius:7, background:"rgba(255,255,255,0.04)", fontSize:11 }}>
                        <span style={{ color:C.blue, fontWeight:700 }}>{j.j}: </span>{j.val}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              {gaitView==="deviations" && GAIT_DATA.deviations.map((d,i)=>(
                <Card key={i} delay={i*20} style={{ padding:"12px 14px", marginBottom:7 }}>
                  <div style={{ fontWeight:700, fontSize:12, marginBottom:5 }}>{d.deviation}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 10px", fontSize:11, marginBottom:5 }}>
                    <div><span style={{ color:C.gold, fontWeight:700 }}>Cause: </span><span style={{ color:"#94a3b8" }}>{d.cause}</span></div>
                    <div><span style={{ color:C.blue, fontWeight:700 }}>Plane: </span><span style={{ color:"#94a3b8" }}>{d.plane}</span></div>
                  </div>
                  <div style={{ fontSize:11, color:C.green }}>💡 {d.fix}</div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ══════════ MMT ══════════ */}
        {activeTab==="mmt" && (
          <>
            <ST title="Manual Muscle Testing (MMT)" sub="Grading scale 0–5" />
            {MMT_DATA.map((m,i) => {
              const g = parseFloat(m.grade);
              const pct = (g/5)*100;
              const col = g===5?"#22c55e":g>=3?"#38bdf8":g>=1?"#f59e0b":"#475569";
              return (
                <Card key={i} delay={i*18} style={{ padding:"13px 15px", marginBottom:7 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                    <div style={{ minWidth:44, height:44, borderRadius:10, background:`linear-gradient(135deg,${col}33,${col}11)`, border:`1px solid ${col}55`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:col }}>{m.grade}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{m.thai}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{m.description}</div>
                      <div style={{ marginTop:6, height:4, borderRadius:4, background:"rgba(255,255,255,0.06)" }}>
                        <div style={{ height:"100%", borderRadius:4, background:col, width:`${pct}%`, transition:"width 0.8s ease" }} />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {/* ══════════ OUTCOME MEASURES ══════════ */}
        {activeTab==="outcomes" && !selectedOutcome && (
          <>
            <ST title="Outcome Measures" sub="Functional scales & scoring" />
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {OUTCOME_MEASURES.map((o,i) => (
                <Card key={i} onClick={() => setSelectedOutcome(o)} delay={i*30} style={{ cursor:"pointer", padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:26 }}>{o.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontWeight:700, fontSize:15 }}>{o.name}</span>
                        <Chip label={o.category} color={C.purple} />
                      </div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:3, lineHeight:1.5 }}>{o.description}</div>
                    </div>
                    <span style={{ color:C.blue, fontSize:16 }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {activeTab==="outcomes" && selectedOutcome && (
          <>
            <Back onClick={() => setSelectedOutcome(null)} />
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <span style={{ fontSize:36 }}>{selectedOutcome.icon}</span>
              <div><h2 style={{ margin:0, fontSize:19, fontWeight:800 }}>{selectedOutcome.name}</h2><Chip label={selectedOutcome.category} color={C.purple} /></div>
            </div>
            <Card style={{ marginBottom:12, padding:15 }}><Lbl>คำอธิบาย</Lbl><p style={{ margin:0, fontSize:13, lineHeight:1.7 }}>{selectedOutcome.description}</p></Card>
            <Card style={{ marginBottom:12, padding:15 }}><Lbl>วิธีใช้</Lbl><p style={{ margin:0, fontSize:13, lineHeight:1.7 }}>{selectedOutcome.howto}</p></Card>
            <Card style={{ marginBottom:12, padding:15 }}>
              <Lbl>การแปลผล</Lbl>
              {selectedOutcome.interpret.map((r,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)" }}>
                  <div style={{ minWidth:8, height:8, borderRadius:"50%", background:r.color }} />
                  <span style={{ fontWeight:700, fontSize:13, color:r.color, minWidth:60 }}>{r.range}</span>
                  <span style={{ fontSize:13, color:"#94a3b8" }}>{r.meaning}</span>
                </div>
              ))}
            </Card>
            {selectedOutcome.mcid && <Card style={{ padding:14, background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.15)" }}><span style={{ fontSize:12, color:C.blue }}>📌 {selectedOutcome.mcid}</span></Card>}
            {selectedOutcome.cutoff && <Card style={{ marginTop:8, padding:14, background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.15)" }}><span style={{ fontSize:12, color:C.gold }}>⚠️ {selectedOutcome.cutoff}</span></Card>}
          </>
        )}

        {/* ══════════ RED FLAGS ══════════ */}
        {activeTab==="redflags" && (
          <>
            <ST title="Red Flag Checker" sub="Screen before every treatment" />
            <div style={{ padding:13, borderRadius:11, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", marginBottom:16, fontSize:12, color:"#fca5a5", animation:"pulse 2s infinite" }}>
              🚨 <b>พบ Red Flag → หยุด treat, document, ส่งต่อแพทย์ทันที</b>
            </div>
            {RED_FLAGS.map((cat,i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:800, color:cat.color, marginBottom:8, letterSpacing:"0.06em" }}>{cat.category}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {cat.flags.map((f,j) => (
                    <Card key={j} delay={j*20} style={{ padding:"12px 14px", borderLeft:`3px solid ${cat.color}` }}>
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>{f.flag}</div>
                      <div style={{ fontSize:12, color:"#64748b", lineHeight:1.5 }}>{f.detail}</div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ══════════ ELECTROTHERAPY ══════════ */}
        {activeTab==="electro" && !selectedElectro && (
          <>
            <ST title="Electrotherapy Parameters" sub="Settings & contraindications" />
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {ELECTRO_DATA.map((e,i) => (
                <Card key={i} onClick={() => setSelectedElectro(e)} delay={i*30} style={{ cursor:"pointer", padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <span style={{ fontSize:26 }}>{e.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{e.modality}</div>
                      <div style={{ fontSize:11, color:"#64748b", marginTop:3 }}>{e.indication}</div>
                    </div>
                    <span style={{ color:C.blue, fontSize:16 }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {activeTab==="electro" && selectedElectro && (
          <>
            <Back onClick={() => setSelectedElectro(null)} />
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <span style={{ fontSize:34 }}>{selectedElectro.icon}</span>
              <div><h2 style={{ margin:0, fontSize:19, fontWeight:800 }}>{selectedElectro.modality}</h2><p style={{ margin:0, fontSize:12, color:C.blue }}>{selectedElectro.indication}</p></div>
            </div>
            <Card style={{ marginBottom:12, padding:15 }}>
              <Lbl>Parameters</Lbl>
              {selectedElectro.params.map((p,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:13 }}>
                  <span style={{ color:"#94a3b8" }}>{p.label}</span>
                  <span style={{ fontWeight:700, color:C.blue }}>{p.value || p.result}</span>
                </div>
              ))}
            </Card>
            <Card style={{ marginBottom:12, padding:15, background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)" }}>
              <Lbl color="#ef4444">Contraindications</Lbl>
              {selectedElectro.contra.map((c,i) => <div key={i} style={{ fontSize:12, color:"#fca5a5", marginBottom:5 }}>🚫 {c}</div>)}
            </Card>
            <Card style={{ padding:14, background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.12)" }}>
              <span style={{ fontSize:12, color:C.gold }}>💡 {selectedElectro.note}</span>
            </Card>
          </>
        )}

        {/* ══════════ DRUGS ══════════ */}
        {activeTab==="drugs" && !selectedDrug && (
          <>
            <ST title="Drug Reference for PT" sub="Medications relevant to physiotherapy" />
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {DRUG_NOTES.map((d,i) => {
                const fc = d.flag==="red"?"#ef4444":d.flag==="yellow"?"#f59e0b":"#22c55e";
                return (
                  <Card key={i} onClick={() => setSelectedDrug(d)} delay={i*30} style={{ cursor:"pointer", padding:"14px 16px", borderLeft:`3px solid ${fc}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                      <span style={{ fontSize:24 }}>{d.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>{d.drug}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{d.category}</div>
                      </div>
                      <div style={{ minWidth:8, height:8, borderRadius:"50%", background:fc }} />
                    </div>
                  </Card>
                );
              })}
            </div>
            <div style={{ marginTop:14, padding:12, borderRadius:10, background:"rgba(255,255,255,0.03)", fontSize:11, color:"#475569" }}>
              🔴 ระมัดระวังมาก &nbsp;|&nbsp; 🟡 ระมัดระวัง &nbsp;|&nbsp; 🟢 ปลอดภัย / ยังแนะนำ exercise
            </div>
          </>
        )}
        {activeTab==="drugs" && selectedDrug && (
          <>
            <Back onClick={() => setSelectedDrug(null)} />
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <span style={{ fontSize:32 }}>{selectedDrug.icon}</span>
              <div><h2 style={{ margin:0, fontSize:17, fontWeight:800, lineHeight:1.4 }}>{selectedDrug.drug}</h2><Chip label={selectedDrug.category} color={C.purple} /></div>
            </div>
            <Card style={{ marginBottom:12, padding:15 }}>
              <Lbl>ผลที่เกี่ยวข้องกับ PT</Lbl>
              {selectedDrug.ptRelevance.map((r,i) => <div key={i} style={{ display:"flex", gap:8, fontSize:13, marginBottom:6 }}><span style={{ color:C.blue, fontSize:9, marginTop:4 }}>◆</span>{r}</div>)}
            </Card>
            <Card style={{ padding:14, background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.12)" }}>
              <Lbl color={C.gold}>PT Consideration</Lbl>
              <p style={{ margin:0, fontSize:13, color:C.gold }}>{selectedDrug.interaction}</p>
            </Card>
          </>
        )}

        {/* ══════════ SOAP NOTE ══════════ */}
        {activeTab==="soap" && (
          <>
            <ST title="SOAP Note" sub="PT documentation — บันทึกได้เลย" />
            {/* Patient name field */}
            <div style={{ marginBottom:12 }}>
              <input value={soapPatient} onChange={e => setSoapPatient(e.target.value)}
                placeholder="👤 ชื่อผู้ป่วย / HN (เพื่อแยก note)"
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid rgba(167,139,250,0.25)", background:T.input, color:T.text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
            {/* S O A P tabs */}
            <div style={{ display:"flex", gap:4, marginBottom:14 }}>
              {Object.entries(SOAP_TEMPLATE).map(([k,v]) => (
                <button key={k} onClick={() => setSoapSection(k)} style={{ flex:1, padding:"10px 4px", border:`1px solid ${soapSection===k ? v.color+"55" : "rgba(255,255,255,0.07)"}`, cursor:"pointer", borderRadius:9, fontSize:11, fontWeight:800, fontFamily:"inherit", transition:"all 0.2s", background: soapSection===k ? `${v.color}22` : "rgba(255,255,255,0.03)", color: soapSection===k ? v.color : "#475569" }}>
                  {k}<div style={{ fontSize:9, fontWeight:500, marginTop:2, opacity:0.7 }}>{v.label}</div>
                </button>
              ))}
            </div>
            {(() => {
              const sec = SOAP_TEMPLATE[soapSection];
              const noteKey = soapSection;
              return (
                <Card style={{ padding:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:4, height:24, borderRadius:2, background:sec.color }} />
                    <div style={{ fontWeight:800, fontSize:15, color:sec.color }}>{soapSection} — {sec.label}</div>
                    <span style={{ marginLeft:"auto", fontSize:10, color:"#22c55e", opacity: lastSaved===noteKey ? 1 : 0, transition:"opacity 0.5s" }}>✓ บันทึกแล้ว</span>
                  </div>
                  {/* Editable textarea */}
                  <textarea
                    value={getNote(noteKey)}
                    onChange={e => saveSoapNote(noteKey, e.target.value)}
                    placeholder={sec.prompts.map((p,i) => `${i+1}. ${p}`).join("
")}
                    rows={10}
                    style={{ width:"100%", padding:"12px", borderRadius:9, border:`1px solid ${sec.color}33`, background:"rgba(255,255,255,0.03)", color:"#e2eaf3", fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", lineHeight:1.7, boxSizing:"border-box" }}
                  />
                  <div style={{ fontSize:10, color:"#475569", marginTop:4, textAlign:"right" }}>💾 บันทึกอัตโนมัติทุกครั้งที่พิมพ์</div>
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <button onClick={() => { const txt = Object.entries(SOAP_TEMPLATE).map(([k])=>`=== ${k} — ${SOAP_TEMPLATE[k].label} ===
${getNote(k)||"-"}`).join("

"); navigator.clipboard?.writeText(txt).then(()=>alert("คัดลอก SOAP note แล้ว!")); }}
                      style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid rgba(56,189,248,0.25)", background:"rgba(56,189,248,0.1)", color:"#38bdf8", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      📋 Copy ทั้ง note
                    </button>
                    <button onClick={() => { if(confirm("ล้าง note ของผู้ป่วยนี้?")) { ["S","O","A","P"].forEach(k => saveSoapNote(k,"")); } }}
                      style={{ padding:"9px 14px", borderRadius:9, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.07)", color:"#f87171", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      🗑️ ล้าง
                    </button>
                  </div>
                  {/* Prompt reference */}
                  <div style={{ marginTop:12, padding:10, borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:10, color:"#475569", marginBottom:6, fontWeight:700 }}>PROMPTS / CHECKLIST</div>
                    {sec.prompts.map((p,i) => (
                      <div key={i} style={{ fontSize:11, color:"#475569", marginBottom:4, lineHeight:1.5 }}>
                        <span style={{ color:sec.color, marginRight:6 }}>▸</span>{p}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })()}

            {/* ── Posture Checklist embedded in SOAP ── */}
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#a78bfa", marginBottom:10, letterSpacing:"0.04em" }}>🧍 POSTURE CHECKLIST</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                {POSTURE_CHECKLIST.views.map(v=>(
                  <button key={v.view} onClick={()=>setPostureView(v.view)}
                    style={{ padding:"6px 12px", borderRadius:20, border:"1px solid", borderColor:postureView===v.view?"#a78bfa":"rgba(255,255,255,0.1)", background:postureView===v.view?"rgba(167,139,250,0.12)":"transparent", color:postureView===v.view?"#a78bfa":"#64748b", fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>{v.view}</button>
                ))}
              </div>
              {POSTURE_CHECKLIST.views.filter(v=>v.view===postureView).map(view=>(
                <div key={view.view}>
                  {view.items.map((item,i)=>(
                    <Card key={i} style={{ padding:"9px 13px", marginBottom:5 }}>
                      <div style={{ display:"flex", gap:10 }}>
                        <div style={{ minWidth:62, fontSize:10, fontWeight:800, color:"#a78bfa", paddingTop:1 }}>{item.area}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:11, color:"#22c55e", marginBottom:1 }}>✅ {item.normal}</div>
                          <div style={{ fontSize:11, color:"#f59e0b" }}>⚠️ {item.deviation}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════════ GLOBAL SEARCH OVERLAY ══════════ */}
        {showSearch && searchQuery2.length>=2 && (() => {
          const q = searchQuery2.toLowerCase();
          const results = [
            ...CONDITIONS_DATA.filter(cx=>cx.name.toLowerCase().includes(q)||cx.thai.includes(q)||cx.tests.some(t=>t.name.toLowerCase().includes(q))).map(cx=>({type:"Condition",label:cx.name,sub:cx.thai,icon:cx.icon,action:()=>{setShowSearch(false);setSearchQuery2("");setActiveTab("conditions");setSelectedCondition(cx);}})),
            ...DRUG_NOTES.filter(d=>d.drug.toLowerCase().includes(q)||d.category.toLowerCase().includes(q)).map(d=>({type:"Drug",label:d.drug,sub:d.category,icon:d.icon,action:()=>{setShowSearch(false);setSearchQuery2("");setActiveTab("drugs");setSelectedDrug(d);}})),
            ...ELECTRO_DATA.filter(e=>e.modality.toLowerCase().includes(q)).map(e=>({type:"Electro",label:e.modality,sub:e.indication,icon:e.icon,action:()=>{setShowSearch(false);setSearchQuery2("");setActiveTab("electro");setSelectedElectro(e);}})),
            ...DIFF_DX.filter(d=>d.symptom.includes(q)||d.conditions.some(x=>x.name.toLowerCase().includes(q))).map(d=>({type:"Diff Dx",label:d.symptom,sub:`${d.conditions.length} conditions`,icon:"🔎",action:()=>{setShowSearch(false);setSearchQuery2("");setActiveTab("diffdx");setDiffSymptom(d);}})),
          ];
          return results.length>0 ? (
            <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"80px 16px 16px" }} onClick={()=>{setShowSearch(false);setSearchQuery2("");}}>
              <div style={{ width:"100%", maxWidth:600, background:T.searchBg, borderRadius:14, border:"1px solid rgba(56,189,248,0.2)", overflow:"auto", maxHeight:"70vh" }} onClick={e=>e.stopPropagation()}>
                <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)", fontSize:11, color:"#475569" }}>{results.length} results</div>
                {results.map((r,i)=>(
                  <div key={i} onClick={r.action} style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(56,189,248,0.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{ fontSize:20 }}>{r.icon}</span>
                    <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700 }}>{r.label}</div><div style={{ fontSize:11, color:"#64748b" }}>{r.sub}</div></div>
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(56,189,248,0.1)", color:"#38bdf8" }}>{r.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* ══════════ CALCULATOR ══════════ */}
        {activeTab==="calc" && (
          <>
            <ST title="Clinical Calculator" sub="BMI, THR, 6MWT, ABI, MAP, IBW" />
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
              {[["bmi","BMI"],["thr","Target HR"],["sixmwt","6MWT"],["abi","ABI"],["map","MAP"],["ibw","IBW"]].map(([id,label])=>(
                <button key={id} onClick={()=>{setCalcTab(id);setCalcInputs({});setCalcResult(null);}}
                  style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", borderColor:calcTab===id?"#38bdf8":"rgba(255,255,255,0.1)", background:calcTab===id?"rgba(56,189,248,0.14)":"transparent", color:calcTab===id?"#38bdf8":"#64748b", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>{label}</button>
              ))}
            </div>
            <Card style={{ padding:18 }}>
              {calcTab==="bmi" && <CalcBMI inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {calcTab==="thr" && <CalcTHR inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {calcTab==="sixmwt" && <CalcSixMWT inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {calcTab==="abi" && <CalcABI inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {calcTab==="map" && <CalcMAP inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {calcTab==="ibw" && <CalcIBW inputs={calcInputs} setInputs={setCalcInputs} result={calcResult} setResult={setCalcResult} C={C} />}
              {/* Clear + Share */}
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                <button onClick={() => { setCalcInputs({}); setCalcResult(null); }}
                  style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.07)", color:"#f87171", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  🔄 Clear
                </button>
                {calcResult && (
                  <button onClick={() => {
                    const labels = {bmi:"BMI",thr:"Target HR",sixmwt:"6MWT Predicted",abi:"ABI",map:"MAP",ibw:"IBW"};
                    const txt = `PT Calculator — ${labels[calcTab]}: ${calcResult.bmi||calcResult.thr||calcResult.pred||calcResult.abi||calcResult.map||calcResult.ibw||""} ${calcResult.cat||calcResult.interp||""}`;
                    navigator.clipboard?.writeText(txt).then(()=>alert("คัดลอกผลแล้ว!"));
                  }}
                    style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid rgba(56,189,248,0.25)", background:"rgba(56,189,248,0.1)", color:"#38bdf8", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    📤 Share ผล
                  </button>
                )}
              </div>
            </Card>
          </>
        )}

        {/* ══════════ DIFF DX ══════════ */}
        {activeTab==="diffdx" && !diffSymptom && (
          <>
            <ST title="Differential Diagnosis" sub="Select symptom to screen conditions" />
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {DIFF_DX.map((d,i)=>(
                <Card key={i} onClick={()=>setDiffSymptom(d)} delay={i*30} style={{ cursor:"pointer", padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>🔎</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{d.symptom}</div>
                      <div style={{ fontSize:11, color:"#64748b", marginTop:3 }}>{d.conditions.length} possible conditions</div>
                    </div>
                    <span style={{ color:C.blue, fontSize:16 }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {activeTab==="diffdx" && diffSymptom && (
          <>
            <Back onClick={()=>setDiffSymptom(null)} />
            <ST title={diffSymptom.symptom} sub="เรียงตามความน่าจะเป็น" />
            {diffSymptom.conditions.map((cond,i)=>{
              const probColor = cond.prob==="สูง"?"#ef4444":cond.prob.includes("ปาน")?"#f59e0b":"#64748b";
              return (
                <Card key={i} delay={i*30} style={{ padding:"14px 16px", marginBottom:9, borderLeft:`3px solid ${probColor}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{cond.name}</span>
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:`${probColor}22`, color:probColor, fontWeight:700, border:`1px solid ${probColor}44` }}>Probability: {cond.prob}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#94a3b8" }}>💡 {cond.clue}</div>
                </Card>
              );
            })}
          </>
        )}

        {/* ══════════ TIMER ══════════ */}
        {activeTab==="timer" && <TimerTab C={C} />}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// TIMER COMPONENT
// ─────────────────────────────────────────────
const PRESETS = [
  { name: "6 นาทีเดิน (6MWT)", seconds: 360, icon: "🚶", color: "#38bdf8",
    tip: "เริ่มจับเวลาเมื่อผู้ป่วยเริ่มเดิน บันทึกระยะทางเมื่อหมดเวลา" },
  { name: "Berg Balance — ยืน 1 ขา", seconds: 10, icon: "⚖️", color: "#a78bfa",
    tip: "ให้คะแนน: ยืนได้ >10 วิ = 4 คะแนน, 5–10 วิ = 3 คะแนน, 3–4 วิ = 2 คะแนน" },
  { name: "Berg Balance — ยืน tandem", seconds: 30, icon: "⚖️", color: "#a78bfa",
    tip: "ยืนเท้าชิดแบบ tandem ค้างไว้ 30 วิ" },
  { name: "MMT — Hold time", seconds: 5, icon: "💪", color: "#34d399",
    tip: "ให้ผู้ป่วยค้างท่าต้านแรง 5 วินาที" },
  { name: "Deep Neck Flexor Test", seconds: 39, icon: "🔄", color: "#fbbf24",
    tip: "ยก head 2.5 cm ค้างไว้ ปกติ ≥39 วิ (ชาย) / ≥29 วิ (หญิง)" },
  { name: "Plank Test", seconds: 60, icon: "🏋️", color: "#f97316",
    tip: "จับเวลา plank ประเมิน core endurance" },
  { name: "Phalen's Test", seconds: 60, icon: "🤲", color: "#f43f5e",
    tip: "ให้ข้อมืองอ max flex ค้าง 60 วิ ถ้าชาร้าวนิ้ว = Positive CTS" },
  { name: "Carpal Compression (Durkan)", seconds: 30, icon: "🤲", color: "#f43f5e",
    tip: "กดบริเวณ carpal tunnel ค้าง 30 วิ" },
  { name: "จับเวลาเอง (Custom)", seconds: 0, icon: "⏱️", color: "#64748b",
    tip: "ตั้งเวลาเองได้เลย" },
];

function TimerTab({ C }) {
  const [preset, setPreset] = useState(null);
  const [customSec, setCustomSec] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState("countdown"); // countdown | stopwatch
  const intervalRef = React.useRef(null);

  const clearTimer = () => { clearInterval(intervalRef.current); intervalRef.current = null; };

  const selectPreset = (p) => {
    clearTimer(); setRunning(false); setFinished(false); setElapsed(0);
    setPreset(p);
    if (p.seconds > 0) {
      setMode("countdown"); setTimeLeft(p.seconds); setTotalTime(p.seconds);
    } else {
      setMode("stopwatch"); setTimeLeft(0); setTotalTime(0);
    }
  };

  const start = () => {
    if (finished) { reset(); return; }
    if (mode === "countdown" && timeLeft <= 0) return;
    setRunning(true); setFinished(false);
    if (mode === "countdown") {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearTimer(); setRunning(false); setFinished(true); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
  };

  const pause = () => { clearTimer(); setRunning(false); };

  const reset = () => {
    clearTimer(); setRunning(false); setFinished(false); setElapsed(0);
    if (mode === "countdown") setTimeLeft(preset?.seconds || customSec);
    else setTimeLeft(0);
  };

  const setCustom = (s) => {
    setCustomSec(s); clearTimer(); setRunning(false); setFinished(false);
    setMode("countdown"); setTimeLeft(s); setTotalTime(s); setElapsed(0);
  };

  React.useEffect(() => () => clearTimer(), []);

  const display = mode === "countdown" ? timeLeft : elapsed;
  const mm = String(Math.floor(display / 60)).padStart(2, "0");
  const ss = String(display % 60).padStart(2, "0");
  const pct = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const activeColor = preset?.color || C.blue;

  return (
    <>
      <ST title="จับเวลา" sub="สำหรับ 6MWT, Berg, MMT, Special Tests" />

      {/* Preset list */}
      {!preset && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {PRESETS.map((p,i) => (
            <Card key={i} onClick={() => selectPreset(p)} delay={i*25} style={{ cursor:"pointer", padding:"13px 15px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>{p.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>
                    {p.seconds > 0 ? `${Math.floor(p.seconds/60) > 0 ? Math.floor(p.seconds/60)+"นาที " : ""}${p.seconds%60 > 0 ? p.seconds%60+"วินาที" : ""}` : "ตั้งเวลาเอง"}
                  </div>
                </div>
                <span style={{ color:p.color, fontSize:16 }}>›</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timer screen */}
      {preset && (
        <>
          <Back onClick={() => { clearTimer(); setPreset(null); setRunning(false); setFinished(false); setElapsed(0); }} />

          <div style={{ textAlign:"center", padding:"10px 0 20px" }}>
            <div style={{ fontSize:14, color:activeColor, fontWeight:700, marginBottom:4 }}>{preset.icon} {preset.name}</div>

            {/* Custom input */}
            {preset.seconds === 0 && !running && !finished && (
              <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center", marginBottom:16 }}>
                <button onClick={() => setCustom(Math.max(5, customSec-5))}
                  style={{ width:36, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)", color:"#e2eaf3", fontSize:20, cursor:"pointer" }}>−</button>
                <div style={{ minWidth:90, textAlign:"center", fontSize:20, fontWeight:700, color:"#e2eaf3" }}>
                  {String(Math.floor(customSec/60)).padStart(2,"0")}:{String(customSec%60).padStart(2,"0")}
                </div>
                <button onClick={() => setCustom(customSec+5)}
                  style={{ width:36, height:36, borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)", color:"#e2eaf3", fontSize:20, cursor:"pointer" }}>+</button>
              </div>
            )}

            {/* Big timer display */}
            <div style={{ position:"relative", width:220, height:220, margin:"0 auto 20px" }}>
              <svg viewBox="0 0 220 220" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
                <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                <circle cx="110" cy="110" r="96" fill="none" stroke={finished?"#22c55e":activeColor}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*96}`}
                  strokeDashoffset={`${2*Math.PI*96*(1 - (mode==="countdown"?pct/100:(elapsed%60)/60))}`}
                  style={{ transition:"stroke-dashoffset 0.5s linear" }}/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                {finished ? (
                  <>
                    <div style={{ fontSize:42 }}>✅</div>
                    <div style={{ fontSize:13, color:"#22c55e", fontWeight:700, marginTop:4 }}>หมดเวลา!</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:52, fontWeight:900, fontVariantNumeric:"tabular-nums", color: running ? activeColor : "#e2eaf3", lineHeight:1 }}>
                      {mm}:{ss}
                    </div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:6 }}>
                      {mode==="countdown" ? "นับถอยหลัง" : "นับเวลา"}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
              <button onClick={reset}
                style={{ padding:"12px 24px", borderRadius:12, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.06)", color:"#94a3b8", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                รีเซ็ต
              </button>
              <button onClick={running ? pause : start}
                style={{ padding:"12px 36px", borderRadius:12, border:"none", background: running ? "rgba(239,68,68,0.8)" : `linear-gradient(135deg,${activeColor},${activeColor}cc)`, color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 16px ${activeColor}44` }}>
                {finished ? "เริ่มใหม่" : running ? "หยุด" : timeLeft===totalTime && !running && elapsed===0 ? "เริ่ม" : "ต่อ"}
              </button>
            </div>

            {/* Tip */}
            <div style={{ padding:"11px 14px", borderRadius:10, background:`${activeColor}11`, border:`1px solid ${activeColor}22`, fontSize:12, color:"#94a3b8", textAlign:"left", lineHeight:1.6 }}>
              💡 {preset.tip}
            </div>

            {/* Stopwatch mode toggle for custom */}
            {preset.seconds === 0 && (
              <div style={{ marginTop:12, display:"flex", gap:6, justifyContent:"center" }}>
                {["countdown","stopwatch"].map(m => (
                  <button key={m} onClick={() => { clearTimer(); setRunning(false); setFinished(false); setElapsed(0); setMode(m); setTimeLeft(m==="countdown"?customSec:0); setTotalTime(m==="countdown"?customSec:0); }}
                    style={{ padding:"6px 16px", borderRadius:20, border:"1px solid", borderColor:mode===m?activeColor:"rgba(255,255,255,0.1)", background:mode===m?`${activeColor}18`:"transparent", color:mode===m?activeColor:"#64748b", fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                    {m==="countdown"?"⏬ นับถอยหลัง":"⏫ จับเวลา"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// STATIC SVG FALLBACK (offline)
// ─────────────────────────────────────────────
function getStaticSvg(testName) {
  const name = testName.toLowerCase();
  // Supine position - for most lying tests
  const supine = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" style="width:100%;height:auto;display:block">
    <rect width="320" height="200" fill="#0b1520"/>
    <line x1="40" y1="130" x2="280" y2="130" stroke="#334155" stroke-width="2"/>
    <ellipse cx="70" cy="112" rx="18" ry="18" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="70" y1="130" x2="240" y2="130" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
    <line x1="140" y1="130" x2="155" y2="155" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <line x1="155" y1="155" x2="190" y2="155" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <line x1="200" y1="130" x2="215" y2="155" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <line x1="215" y1="155" x2="255" y2="155" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <line x1="100" y1="125" x2="115" y2="155" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <line x1="115" y1="125" x2="130" y2="155" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <text x="160" y="30" text-anchor="middle" font-family="Arial" font-size="11" fill="#38bdf8" font-weight="700">${testName}</text>
    <text x="160" y="50" text-anchor="middle" font-family="Arial" font-size="9" fill="#64748b">Supine position</text>
    <path d="M250 90 L270 110 L250 110" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <text x="160" y="185" text-anchor="middle" font-family="Arial" font-size="9" fill="#475569">⚡ offline mode — diagram unavailable</text>
  </svg>`;

  const standing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" style="width:100%;height:auto;display:block">
    <rect width="320" height="200" fill="#0b1520"/>
    <ellipse cx="160" cy="40" rx="16" ry="16" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="160" y1="56" x2="160" y2="120" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
    <line x1="160" y1="75" x2="130" y2="105" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <line x1="160" y1="75" x2="190" y2="105" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <line x1="160" y1="120" x2="140" y2="170" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <line x1="160" y1="120" x2="180" y2="170" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/>
    <text x="160" y="30" text-anchor="middle" font-family="Arial" font-size="11" fill="#38bdf8" font-weight="700" dy="-5">${testName}</text>
    <text x="160" y="190" text-anchor="middle" font-family="Arial" font-size="9" fill="#475569">⚡ offline mode — connect for AI diagram</text>
  </svg>`;

  if (name.includes("slr") || name.includes("lachman") || name.includes("drawer") || name.includes("phalen") || name.includes("durkan") || name.includes("slump") || name.includes("faber") || name.includes("fadir") || name.includes("thomas") || name.includes("ely") || name.includes("apley") || name.includes("mcmurray") || name.includes("thessaly")) return supine;
  return standing;
}

// ─────────────────────────────────────────────
// CONDITION DETAIL WITH AI SVG ILLUSTRATION
// ─────────────────────────────────────────────
function ConditionDetail({ condition, onBack, C }) {
  const [svgs, setSvgs] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (!condition) return;
    setSvgs({});
    condition.tests.forEach((t, i) => fetchSvg(t.name, t.desc || "", i));
  }, [condition?.name]);

  async function fetchSvg(testName, desc, idx) {
    // Skip if offline
    if (!navigator.onLine) {
      setSvgs(prev => ({ ...prev, [idx]: getStaticSvg(testName) }));
      return;
    }
    setLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Create a simple SVG diagram (viewBox="0 0 320 200") illustrating the physical therapy special test: "${testName}".
Context: ${desc}

Rules:
- Use ONLY basic SVG shapes: circle, ellipse, rect, line, path, text
- Draw stick-figure style: patient lying/sitting/standing + therapist hands
- Dark background: bg rect fill="#0b1520"
- Patient body color: "#38bdf8" (blue)
- Therapist hands/arrows: "#fbbf24" (yellow)
- Labels: white text, font-size 11px
- Show the key movement direction with an arrow
- Keep it simple and clear, max 25 elements
- NO external images, NO xmlns declarations in child elements
- Return ONLY the raw SVG code starting with <svg and ending with </svg>, no explanation, no markdown`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("").trim();
      const match = text.match(/<svg[\s\S]*<\/svg>/i);
      if (match) setSvgs(prev => ({ ...prev, [idx]: match[0] }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, [idx]: false }));
    }
  }

  return (
    <>
      <Back onClick={onBack} />
      <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:18 }}>
        <span style={{ fontSize:38 }}>{condition.icon}</span>
        <div>
          <h2 style={{ margin:0, fontSize:19, fontWeight:800 }}>{condition.name}</h2>
          <p style={{ margin:0, fontSize:13, color:C.blue }}>{condition.thai}</p>
        </div>
      </div>
      <Card style={{ marginBottom:12, padding:15 }}>
        <Lbl>คำอธิบาย</Lbl>
        <p style={{ margin:0, fontSize:13, lineHeight:1.7 }}>{condition.description}</p>
      </Card>
      <Card style={{ marginBottom:12, padding:15 }}>
        <Lbl>Clinical Signs</Lbl>
        {condition.signs.map((s,i) => (
          <div key={i} style={{ display:"flex", gap:9, fontSize:13, marginBottom:5 }}>
            <span style={{ color:C.blue, fontSize:9, marginTop:4 }}>◆</span>{s}
          </div>
        ))}
        {/* Quick copy summary button */}
        <button onClick={() => {
          const tests = condition.tests.map(t=>`• ${t.name}: ${t.result}`).join("\n");
          const text = `${condition.name} (${condition.thai})\n\nSigns:\n${condition.signs.map(s=>`• ${s}`).join("\n")}\n\nSpecial Tests:\n${tests}`;
          if(navigator.share) navigator.share({ title:condition.name, text });
          else navigator.clipboard?.writeText(text).then(()=>alert("คัดลอก Quick Reference แล้ว!"));
        }} style={{ marginTop:10, width:"100%", padding:"9px", borderRadius:9, border:"1px solid rgba(56,189,248,0.25)", background:"rgba(56,189,248,0.08)", color:"#38bdf8", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          📤 Copy Quick Reference Card
        </button>
      </Card>
      {condition.phase && (
        <Card style={{ marginBottom:12, padding:15 }}>
          <Lbl>Phases</Lbl>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {condition.phase.map((p,i) => <Chip key={i} label={`${i+1}. ${p}`} color={C.blue} />)}
          </div>
        </Card>
      )}
      {/* Exercise Rx for this condition */}
      {(() => {
        const exData = EXERCISE_RX.find(e => condition.name.includes(e.condition.split(" ")[0]) || e.condition.includes(condition.name.split(" ")[0]));
        if (!exData) return null;
        return (
          <Card style={{ marginBottom:12, padding:15 }}>
            <Lbl color="#34d399">Exercise Prescription</Lbl>
            {exData.phases.map((ph,i) => (
              <div key={i} style={{ marginBottom:10, padding:"10px 12px", borderRadius:9, background:"rgba(52,211,153,0.05)", border:`1px solid rgba(52,211,153,0.15)` }}>
                <div style={{ fontWeight:700, fontSize:12, color:["#38bdf8","#fbbf24","#34d399"][i]||"#38bdf8", marginBottom:4 }}>Phase {i+1}: {ph.phase}</div>
                <div style={{ fontSize:10, color:"#64748b", marginBottom:6 }}>🎯 {ph.focus}</div>
                {ph.exercises.slice(0,3).map((ex,j) => (
                  <div key={j} style={{ fontSize:11, color:"#94a3b8", marginBottom:3 }}>◆ {ex}</div>
                ))}
                {ph.exercises.length > 3 && <div style={{ fontSize:10, color:"#475569" }}>+{ph.exercises.length-3} more...</div>}
              </div>
            ))}
          </Card>
        );
      })()}

      <Card style={{ padding:15 }}>
        <Lbl>Special Tests</Lbl>
        {condition.tests.map((t,i) => (
          <div key={i} style={{ borderRadius:11, background:"rgba(56,189,248,0.05)", border:"1px solid rgba(56,189,248,0.13)", marginBottom:10, overflow:"hidden" }}>
            {/* SVG illustration area */}
            <div style={{ width:"100%", background:"#0b1520", minHeight:160, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {loading[i] ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:20 }}>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <div style={{ width:26, height:26, border:"3px solid rgba(56,189,248,0.15)", borderTopColor:"#38bdf8", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  <span style={{ fontSize:10, color:"#475569" }}>กำลังสร้างภาพประกอบ...</span>
                </div>
              ) : svgs[i] ? (
                <div style={{ width:"100%", lineHeight:0 }}
                  dangerouslySetInnerHTML={{ __html: svgs[i].replace('<svg', '<svg style="width:100%;height:auto;display:block"') }}
                />
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:20 }}>
                  <span style={{ fontSize:28 }}>🔬</span>
                  <span style={{ fontSize:10, color:"#334155" }}>ภาพกำลังโหลด</span>
                </div>
              )}
            </div>
            {/* Content */}
            <div style={{ padding:"12px 13px" }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>🔬 {t.name}</div>
              {t.desc && (
                <div style={{ fontSize:12, color:"#94a3b8", marginBottom:8, lineHeight:1.65, borderLeft:"2px solid rgba(56,189,248,0.3)", paddingLeft:8 }}>
                  {t.desc}
                </div>
              )}
              <div style={{ fontSize:12, color:C.gold }}><b>Positive:</b> {t.result}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
// ─────────────────────────────────────────────
// CALCULATOR COMPONENTS
// ─────────────────────────────────────────────
function CInput({label, field, unit, inputs, setInputs, type="number"}) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:11, color:"#94a3b8", marginBottom:4, fontWeight:700 }}>{label} {unit && <span style={{ color:"#475569" }}>({unit})</span>}</div>
      <input type={type} value={inputs[field]||""} onChange={e=>setInputs(p=>({...p,[field]:e.target.value}))}
        style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1px solid rgba(56,189,248,0.2)", background:"rgba(255,255,255,0.05)", color:"#e2eaf3", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
    </div>
  );
}
function CResult({label, value, color="#38bdf8", detail}) {
  const share = () => {
    const text = `PT Calculator\n${label}: ${value}\n${detail||""}`;
    if (navigator.share) navigator.share({ title:"PT Pocket Guide", text });
    else navigator.clipboard?.writeText(text).then(()=>alert("คัดลอกแล้ว!"));
  };
  return (
    <div style={{ padding:14, borderRadius:10, background:`${color}11`, border:`1px solid ${color}33`, marginTop:14 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ fontSize:11, color:color, fontWeight:800 }}>{label}</div>
        <button onClick={share} style={{ padding:"3px 10px", borderRadius:8, border:`1px solid ${color}44`, background:`${color}15`, color:color, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>📤 Share</button>
      </div>
      <div style={{ fontSize:28, fontWeight:900, color }}>{value}</div>
      {detail && <div style={{ fontSize:12, color:"#94a3b8", marginTop:6 }}>{detail}</div>}
    </div>
  );
}
function CBtn({onClick}) {
  return <button onClick={onClick} style={{ width:"100%", padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0ea5e9,#38bdf8)", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>คำนวณ</button>;
}

function CalcBMI({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const w=parseFloat(inputs.w), h=parseFloat(inputs.h)/100;
    if(!w||!h) return;
    const bmi=(w/(h*h)).toFixed(1);
    const cat = bmi<18.5?"Underweight":bmi<23?"Normal (Asian)":bmi<25?"Overweight":bmi<30?"Obese I":"Obese II+";
    const col = bmi<18.5?"#f59e0b":bmi<23?"#22c55e":bmi<25?"#fbbf24":"#ef4444";
    setResult({bmi,cat,col});
  };
  return <>
    <Lbl>BMI Calculator</Lbl>
    <CInput label="น้ำหนัก" field="w" unit="kg" inputs={inputs} setInputs={setInputs} />
    <CInput label="ส่วนสูง" field="h" unit="cm" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label="BMI" value={result.bmi} color={result.col} detail={`${result.cat} | เกณฑ์ Asian: Normal = 18.5–22.9`} />}
  </>;
}

function CalcTHR({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const age=parseFloat(inputs.age), hr=parseFloat(inputs.hr), pct=parseFloat(inputs.pct)||60;
    if(!age||!hr) return;
    const hrr=220-age-hr;
    const thr=(hrr*(pct/100)+hr).toFixed(0);
    const thr85=((220-age-hr)*0.85+hr).toFixed(0);
    setResult({thr,thr85,hrmax:220-age});
  };
  return <>
    <Lbl>Target Heart Rate (Karvonen)</Lbl>
    <CInput label="อายุ" field="age" unit="ปี" inputs={inputs} setInputs={setInputs} />
    <CInput label="Resting HR" field="hr" unit="bpm" inputs={inputs} setInputs={setInputs} />
    <CInput label="% Intensity ต้องการ" field="pct" unit="% (default 60)" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label={`THR @ ${inputs.pct||60}%`} value={`${result.thr} bpm`} color={C.blue} detail={`HRmax = ${result.hrmax} | THR @ 85% = ${result.thr85} bpm | Moderate zone = 60–70%`} />}
  </>;
}

function CalcSixMWT({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const age=parseFloat(inputs.age), ht=parseFloat(inputs.ht), wt=parseFloat(inputs.wt), sex=inputs.sex||"m";
    if(!age||!ht||!wt) return;
    let pred;
    if(sex==="m") pred=(7.57*ht)-(5.02*age)-(1.76*wt)-309;
    else pred=(2.11*ht)-(2.29*wt)-(5.78*age)+667;
    setResult({pred:Math.round(pred), lln:Math.round(pred*0.82)});
  };
  return <>
    <Lbl>6-Minute Walk Test (Predicted)</Lbl>
    <div style={{ display:"flex", gap:8, marginBottom:12 }}>
      {["m","f"].map(s=><button key={s} onClick={()=>setInputs(p=>({...p,sex:s}))} style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid", borderColor:inputs.sex===s||(!inputs.sex&&s==="m")?"#38bdf8":"rgba(255,255,255,0.1)", background:inputs.sex===s||(!inputs.sex&&s==="m")?"rgba(56,189,248,0.14)":"transparent", color:inputs.sex===s||(!inputs.sex&&s==="m")?"#38bdf8":"#64748b", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:12 }}>{s==="m"?"ชาย":"หญิง"}</button>)}
    </div>
    <CInput label="อายุ" field="age" unit="ปี" inputs={inputs} setInputs={setInputs} />
    <CInput label="ส่วนสูง" field="ht" unit="cm" inputs={inputs} setInputs={setInputs} />
    <CInput label="น้ำหนัก" field="wt" unit="kg" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label="Predicted 6MWD" value={`${result.pred} m`} color={C.blue} detail={`LLN (Lower Limit of Normal) = ${result.lln} m | Reference: Enright & Sherrill 1998`} />}
  </>;
}

function CalcABI({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const ankle=parseFloat(inputs.ankle), brachial=parseFloat(inputs.brachial);
    if(!ankle||!brachial) return;
    const abi=(ankle/brachial).toFixed(2);
    const interp = abi>1.3?"Calcified vessels (non-compressible)":abi>=0.9?"Normal":abi>=0.7?"Mild PAD":abi>=0.5?"Moderate PAD":"Severe PAD";
    const col = abi>1.3?"#a78bfa":abi>=0.9?"#22c55e":abi>=0.7?"#f59e0b":"#ef4444";
    setResult({abi,interp,col});
  };
  return <>
    <Lbl>Ankle-Brachial Index (ABI)</Lbl>
    <CInput label="Ankle SBP (สูงสุดของสองข้าง)" field="ankle" unit="mmHg" inputs={inputs} setInputs={setInputs} />
    <CInput label="Brachial SBP (สูงสุดของสองข้าง)" field="brachial" unit="mmHg" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label="ABI" value={result.abi} color={result.col} detail={result.interp} />}
  </>;
}

function CalcMAP({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const sbp=parseFloat(inputs.sbp), dbp=parseFloat(inputs.dbp);
    if(!sbp||!dbp) return;
    const map=(dbp+(sbp-dbp)/3).toFixed(1);
    const col = map>=70&&map<=100?"#22c55e":map<70?"#ef4444":"#f59e0b";
    setResult({map,ok:map>=70&&map<=100});
  };
  return <>
    <Lbl>Mean Arterial Pressure (MAP)</Lbl>
    <CInput label="Systolic BP" field="sbp" unit="mmHg" inputs={inputs} setInputs={setInputs} />
    <CInput label="Diastolic BP" field="dbp" unit="mmHg" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label="MAP" value={`${result.map} mmHg`} color={result.ok?"#22c55e":"#ef4444"} detail={`Normal = 70–100 mmHg | <60 mmHg = organ perfusion risk`} />}
  </>;
}

function CalcIBW({inputs,setInputs,result,setResult,C}) {
  const clear = () => { setInputs({}); setResult(null); };
  const calc = () => {
    const ht=parseFloat(inputs.ht), sex=inputs.sex||"m";
    if(!ht) return;
    const htIn=(ht/2.54);
    const ibw = sex==="m" ? 50+2.3*(htIn-60) : 45.5+2.3*(htIn-60);
    const low=Math.round(ibw*0.9), high=Math.round(ibw*1.1);
    setResult({ibw:Math.round(ibw), low, high});
  };
  return <>
    <Lbl>Ideal Body Weight (Devine formula)</Lbl>
    <div style={{ display:"flex", gap:8, marginBottom:12 }}>
      {["m","f"].map(s=><button key={s} onClick={()=>setInputs(p=>({...p,sex:s}))} style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid", borderColor:inputs.sex===s||(!inputs.sex&&s==="m")?"#38bdf8":"rgba(255,255,255,0.1)", background:inputs.sex===s||(!inputs.sex&&s==="m")?"rgba(56,189,248,0.14)":"transparent", color:inputs.sex===s||(!inputs.sex&&s==="m")?"#38bdf8":"#64748b", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:12 }}>{s==="m"?"ชาย":"หญิง"}</button>)}
    </div>
    <CInput label="ส่วนสูง" field="ht" unit="cm" inputs={inputs} setInputs={setInputs} />
    <CBtn onClick={calc} onClear={clear} />
    {result && <CResult label="IBW" value={`${result.ibw} kg`} color={C.blue} detail={`ช่วงปกติ ±10% = ${result.low}–${result.high} kg`} />}
  </>;
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
function Card({ children, onClick, delay=0, style={} }) {
  return (
    <div onClick={onClick} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:13, transition:"all 0.2s", animation:`fadeUp 0.35s ease ${delay}ms both`, WebkitTapHighlightColor:"transparent", color:T.text, ...style }}
      onMouseEnter={e=>{ if(onClick){ e.currentTarget.style.background=darkMode?"rgba(56,189,248,0.07)":"rgba(14,165,233,0.08)"; e.currentTarget.style.borderColor="rgba(14,165,233,0.3)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="translateY(0)"; }}>
      {children}
    </div>
  );
}

function Back({ onClick }) {
  return <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(56,189,248,0.12)", border:"1px solid rgba(56,189,248,0.3)", color:"#38bdf8", padding:"10px 18px", borderRadius:10, fontSize:13, cursor:"pointer", marginBottom:18, fontFamily:"inherit", fontWeight:700, WebkitTapHighlightColor:"transparent" }}>← กลับ</button>;
}

function ST({ title, sub }) {
  return <div style={{ marginBottom:20 }}><h2 style={{ margin:0, fontSize:20, fontWeight:900, letterSpacing:"-0.01em" }}>{title}</h2><p style={{ margin:0, fontSize:12, color:"#64748b", marginTop:4 }}>{sub}</p></div>;
}

function Lbl({ children, color="#38bdf8" }) {
  return <div style={{ fontSize:10, fontWeight:900, letterSpacing:"0.12em", color, marginBottom:10, textTransform:"uppercase" }}>{children}</div>;
}

function Chip({ label, color }) {
  return <span style={{ padding:"3px 9px", borderRadius:20, fontSize:10, background:`${color}18`, border:`1px solid ${color}30`, color, fontWeight:700 }}>{label}</span>;
}
