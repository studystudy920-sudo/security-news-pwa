from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(16.54)   # A3 landscape
prs.slide_height = Inches(11.69)

# Colors
C_RED      = RGBColor(0xC0, 0x39, 0x2B)
C_ORANGE   = RGBColor(0xE6, 0x7E, 0x22)
C_GREEN    = RGBColor(0x27, 0xAE, 0x60)
C_BLUE     = RGBColor(0x29, 0x80, 0xB9)
C_PURPLE   = RGBColor(0x8E, 0x44, 0xAD)
C_DARK     = RGBColor(0x22, 0x22, 0x22)
C_WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
C_LIGHT    = RGBColor(0xFA, 0xFA, 0xFA)
C_GREY_BG  = RGBColor(0xEE, 0xEE, 0xEE)
C_GREY_TXT = RGBColor(0x88, 0x88, 0x88)
C_TAG_BG   = RGBColor(0x34, 0x49, 0x5E)
C_DANGER_BG = RGBColor(0xFD, 0xED, 0xEC)
C_ACTION_BG = RGBColor(0xEA, 0xFA, 0xF1)
C_AUTO_BG   = RGBColor(0xEA, 0xF2, 0xFF)
C_HUMAN_BG  = RGBColor(0xFD, 0xF2, 0xE9)
C_SMS_BG    = RGBColor(0xF4, 0xEC, 0xF7)
C_DECISION  = RGBColor(0xFF, 0xF3, 0xCD)

def add_textbox(slide, left, top, width, height, text, font_size=9,
                bold=False, color=C_DARK, bg=None, align=PP_ALIGN.LEFT,
                anchor=MSO_ANCHOR.TOP):
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.margin_left = Pt(4)
    tf.margin_right = Pt(4)
    tf.margin_top = Pt(3)
    tf.margin_bottom = Pt(3)
    if anchor:
        tf.paragraphs[0].alignment = align
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = "Meiryo"
    if bg:
        txBox.fill.solid()
        txBox.fill.fore_color.rgb = bg
    return txBox

def add_rect(slide, left, top, width, height, fill, text="",
             font_size=10, font_color=C_WHITE, bold=True, align=PP_ALIGN.CENTER):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(4)
    tf.margin_right = Pt(4)
    tf.margin_top = Pt(2)
    tf.margin_bottom = Pt(2)
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.color.rgb = font_color
    run.font.bold = bold
    run.font.name = "Meiryo"
    return shape

def add_bordered_box(slide, left, top, width, height, fill, border_color,
                     text="", font_size=8, font_color=C_DARK, bold=False,
                     align=PP_ALIGN.LEFT):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.color.rgb = border_color
    shape.line.width = Pt(2)
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(5)
    tf.margin_right = Pt(4)
    tf.margin_top = Pt(3)
    tf.margin_bottom = Pt(3)
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.color.rgb = font_color
    run.font.bold = bold
    run.font.name = "Meiryo"
    return shape

def add_diamond(slide, left, top, width, height, text, fill=C_DECISION):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.DIAMOND,
        Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.color.rgb = C_ORANGE
    shape.line.width = Pt(1.5)
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(2)
    tf.margin_right = Pt(2)
    tf.margin_top = Pt(2)
    tf.margin_bottom = Pt(2)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = text
    run.font.size = Pt(7)
    run.font.bold = True
    run.font.name = "Meiryo"
    return shape

# ── Layout constants ──
LEFT_MARGIN = 0.2
COL_PHASE_W = 1.1
LANE_W = 2.85
GAP = 0.04
lane_x = [LEFT_MARGIN + COL_PHASE_W + GAP + i * (LANE_W + GAP) for i in range(5)]
phase_x = LEFT_MARGIN

# Row heights and Y positions
HEADER_H = 0.35
LANE_HDR_H = 0.30
row_y_start = 1.15
ROW_H = [1.05, 1.15, 2.55, 2.60, 2.65, 0.65]
row_y = []
y = row_y_start
for h in ROW_H:
    row_y.append(y)
    y += h + GAP

# ── Slide 1 ──
slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
slide.background.fill.solid()
slide.background.fill.fore_color.rgb = RGBColor(0xF5, 0xF5, 0xF5)

# Title
add_textbox(slide, 0, 0.1, 16.54, 0.5,
            "Fraud Kill Chain（不正送金キルチェーン）",
            font_size=20, bold=True, align=PP_ALIGN.CENTER)
add_textbox(slide, 0, 0.55, 16.54, 0.3,
            'シート名「不審な電話手口」 ― 犯人サイド × 被害企業サイド スイムレーン図',
            font_size=10, color=C_GREY_TXT, align=PP_ALIGN.CENTER)

# ── Actor group headers ──
actor_y = 0.90
add_rect(slide, lane_x[0], actor_y, LANE_W * 2 + GAP, HEADER_H,
         C_DARK, "犯人サイド", 11)
add_rect(slide, lane_x[2], actor_y, LANE_W * 3 + GAP * 2, HEADER_H,
         C_ORANGE, "被害企業サイド", 11)

# ── Lane headers ──
lh_y = actor_y + HEADER_H + GAP
lane_names = ["情報・インフラ", "架電", "受電", "会社のPC", "個人スマホ"]
add_rect(slide, phase_x, lh_y, COL_PHASE_W, LANE_HDR_H,
         C_GREY_BG, "フェーズ", 9, C_DARK)
for i, name in enumerate(lane_names):
    add_rect(slide, lane_x[i], lh_y, LANE_W, LANE_HDR_H,
             C_GREY_BG, name, 9, C_DARK)

# ── Phase labels ──
phase_labels = [
    "① 犯行準備\n（偵察など）",
    "② 被害者への\n接触",
    "③ 心理的操作",
    "④ システムや\n機能の侵害",
    "⑤ 侵害に使用\nする認証情報",
    "⑥ 収益化\n／マネロン",
]
for i, label in enumerate(phase_labels):
    add_rect(slide, phase_x, row_y[i], COL_PHASE_W, ROW_H[i],
             C_RED, label, 10, C_WHITE)

# ── Empty cell backgrounds ──
for i in range(6):
    for j in range(5):
        add_rect(slide, lane_x[j], row_y[i], LANE_W, ROW_H[i],
                 C_WHITE, "", font_size=1, font_color=C_WHITE)

# ── Phase 1 content ──
r = 0
add_bordered_box(slide, lane_x[0] + 0.1, row_y[r] + 0.15, LANE_W - 0.2, 0.55,
                 C_ACTION_BG, C_GREEN,
                 "電話番号・メールアドレスを取得", 8, bold=True)
add_bordered_box(slide, lane_x[1] + 0.1, row_y[r] + 0.15, LANE_W - 0.2, 0.35,
                 C_HUMAN_BG, C_ORANGE, "事前調査", 8)
add_textbox(slide, lane_x[1] + 0.1, row_y[r] + 0.55, LANE_W - 0.2, 0.3,
            "※幅広に架電している印象", 7, color=C_GREY_TXT)

# ── Phase 2 content ──
r = 1
add_bordered_box(slide, lane_x[1] + 0.1, row_y[r] + 0.08, LANE_W - 0.2, 0.85,
                 C_AUTO_BG, C_BLUE,
                 "【自動音声】\n「こちらはMバンく BizSTATION法人窓口です。"
                 "BizSTATIONを利用している方は1を押してください。"
                 "承認実行権限を持っている方は1を押してください」", 7)
add_bordered_box(slide, lane_x[2] + 0.1, row_y[r] + 0.08, LANE_W - 0.2, 0.35,
                 C_ACTION_BG, C_GREEN, "「1」押下", 9, bold=True)
add_textbox(slide, lane_x[2] + 0.1, row_y[r] + 0.50, LANE_W - 0.2, 0.55,
            "※「1」以外を押下した人は、法人ダイレクトオフィス（コールセンター）の電話番号を案内される",
            6, color=C_GREY_TXT)

# ── Phase 3 content ──
r = 2
cy = row_y[r]
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.05, LANE_W - 0.2, 0.70,
                 C_HUMAN_BG, C_ORANGE,
                 "【有人対応】\n「パソコン環境の更新が必要。現在口座の利用制限をしています。"
                 "手続きを郵送していますが、届いてますか。更新されていないので電話しました」",
                 7)
add_textbox(slide, lane_x[1] + 0.1, cy + 0.78, LANE_W - 0.2, 0.2,
            "※複数の誘導方法あり", 6, color=C_GREY_TXT)

add_diamond(slide, lane_x[1] + 0.7, cy + 0.98, 1.4, 0.50,
            "メアド\n入手済／未済？")

add_bordered_box(slide, lane_x[1] + 0.1, cy + 1.52, LANE_W - 0.2, 0.40,
                 C_HUMAN_BG, C_ORANGE,
                 "【未済の場合】\n「手続きをメールで案内するので、メールアドレスを教えてください」",
                 7)

add_bordered_box(slide, lane_x[1] + 0.1, cy + 1.96, LANE_W - 0.2, 0.22,
                 C_HUMAN_BG, C_ORANGE,
                 "→ メール送付", 8, bold=True)

add_bordered_box(slide, lane_x[1] + 0.1, cy + 2.20, LANE_W - 0.2, 0.15,
                 C_LIGHT, C_GREY_TXT,
                 '件名①「【重要】BizSTATIONお客さま情報更新のお知らせ」', 6)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 2.37, LANE_W - 0.2, 0.15,
                 C_LIGHT, C_GREY_TXT,
                 '件名②「【Mバンく】IB安全利用案内（Rapport推奨）」', 6)

# Victim side phase 3
add_bordered_box(slide, lane_x[2] + 0.1, cy + 1.52, LANE_W - 0.2, 0.30,
                 C_ACTION_BG, C_GREEN,
                 "メールアドレスを伝える", 8)
add_bordered_box(slide, lane_x[3] + 0.1, cy + 2.05, LANE_W - 0.2, 0.35,
                 C_ACTION_BG, C_GREEN,
                 "メール受信\n（Bizデザインのメール）", 8)

# ── Phase 4 content ──
r = 3
cy = row_y[r]
# Attacker calls
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.05, LANE_W - 0.2, 0.50,
                 C_HUMAN_BG, C_ORANGE,
                 "【有人対応】\n「セキュリティ強化のためソフトインストールが必要です。"
                 "メールのボタンをクリックしてください」", 7)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.60, LANE_W - 0.2, 0.30,
                 C_HUMAN_BG, C_ORANGE,
                 "「セットアップをクリックしてください」", 7)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.95, LANE_W - 0.2, 0.30,
                 C_HUMAN_BG, C_ORANGE,
                 "「実行するをクリックしてください」", 7)

# Company PC
add_bordered_box(slide, lane_x[3] + 0.1, cy + 0.05, LANE_W - 0.2, 0.35,
                 C_ACTION_BG, C_GREEN,
                 "クリック → ブラウザ表示\n（Bizデザイン重要なお知らせ画面）", 7)
add_bordered_box(slide, lane_x[3] + 0.1, cy + 0.45, LANE_W - 0.2, 0.35,
                 C_DANGER_BG, C_RED,
                 "【DL】リモートツールのセットアップファイル setup.msi がダウンロードされる", 7)
add_bordered_box(slide, lane_x[3] + 0.1, cy + 0.85, LANE_W - 0.2, 0.40,
                 C_DANGER_BG, C_RED,
                 "【実行】msiファイル実行 → ポップアップ「実行する/実行しない」\n※「不明な発行元」と表示", 7)
add_bordered_box(slide, lane_x[3] + 0.1, cy + 1.30, LANE_W - 0.2, 0.30,
                 C_DANGER_BG, C_RED,
                 "【インストール】ScreenConnect（リモートツール）がインストールされる", 7, bold=True)

# Red screen
add_bordered_box(slide, lane_x[3] + 0.1, cy + 1.65, LANE_W - 0.2, 0.85,
                 C_RED, C_RED,
                 "『Mバンく　現在セキュリティ保護強化に伴うシステム更新ならびに、"
                 "お客さま情報の確認、更新処理を実施しております。"
                 "処理完了までの間一時的に画面が遅延または停止する場合がありますが、"
                 "正常な処理となりますのでそのままお待ちくださいますようお願い申し上げます。』",
                 7, C_WHITE)

# ── Phase 5 content ──
r = 4
cy = row_y[r]
# Attacker calls
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.05, LANE_W - 0.2, 0.40,
                 C_HUMAN_BG, C_ORANGE,
                 "「手続きを進めるにはSMS認証が必要なため、お客さまの携帯電話の番号を教えてください」", 7)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.50, LANE_W - 0.2, 0.22,
                 C_SMS_BG, C_PURPLE, "【SMS送付】", 8, bold=True)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.78, LANE_W - 0.2, 0.30,
                 C_HUMAN_BG, C_ORANGE,
                 "「認証画面を表示するためリンクをクリックしてください」", 7)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 1.13, LANE_W - 0.2, 0.45,
                 C_HUMAN_BG, C_ORANGE,
                 "「認証のため契約者番号、利用者ID、ログインPW、取引実行PW、OTPを入力してください」", 7)
add_bordered_box(slide, lane_x[1] + 0.1, cy + 1.65, LANE_W - 0.2, 0.45,
                 C_DANGER_BG, C_RED,
                 "【犯人ブラウザ】赤い画面の裏でBizにアクセス、窃取したOTPを入力", 7, bold=True)

# Victim: phone number
add_bordered_box(slide, lane_x[2] + 0.1, cy + 0.05, LANE_W - 0.2, 0.30,
                 C_ACTION_BG, C_GREEN, "電話番号を伝える", 8)

# Victim: smartphone
add_bordered_box(slide, lane_x[4] + 0.1, cy + 0.50, LANE_W - 0.2, 0.30,
                 C_SMS_BG, C_PURPLE, "SMS受信 → リンクをクリック", 8)
add_bordered_box(slide, lane_x[4] + 0.1, cy + 0.88, LANE_W - 0.2, 0.70,
                 C_DANGER_BG, C_RED,
                 "開いた画面に認証情報を入力\n"
                 "・契約者番号\n・利用者ID\n・ログインPW\n・取引実行PW\n・OTP", 7)

# ── Phase 6 content ──
r = 5
cy = row_y[r]
add_bordered_box(slide, lane_x[1] + 0.1, cy + 0.08, LANE_W - 0.2, 0.45,
                 C_RED, C_RED,
                 "不正送金", 14, C_WHITE, bold=True, align=PP_ALIGN.CENTER)

# ── Footer ──
add_textbox(slide, 10, 11.35, 6.5, 0.25,
            "Fraud Kill Chain — 不審な電話手口 ｜ A3横印刷対応",
            7, color=C_GREY_TXT, align=PP_ALIGN.RIGHT)

# ── Save ──
out = "/home/user/security-news-pwa/Fraud_Kill_Chain.pptx"
prs.save(out)
print(f"Saved: {out}")
