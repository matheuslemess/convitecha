import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/* ============================================================
   CHÁ DE FRALDA DO EZE – Western Vintage Baby Shower
   Layout fiel ao convite de referência
   ============================================================ */

const styles = `
  /* ==============================
     RESET
     ============================== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ==============================
     ANIMATIONS
     ============================== */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes gentleSwing {
    0%, 100% { transform: rotate(-1.5deg); }
    50% { transform: rotate(1.5deg); }
  }

  /* ==============================
     PAGE BACKGROUND — Vinho escuro + xadrez
     ============================== */
  .invitation-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem 0.75rem;
    background-color: #4A1520;
    background-image:
      linear-gradient(0deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 24px 24px, 24px 24px, 12px 12px, 12px 12px;
  }

  /* ==============================
     CARD — Pergaminho central
     ============================== */
  .invitation-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    background: linear-gradient(
      170deg,
      #F7EDDF 0%,
      #F2E4D0 25%,
      #EDD9C1 50%,
      #F2E4D0 75%,
      #F7EDDF 100%
    );
    border-radius: 1rem;
    padding: 0;
    box-shadow:
      0 0 0 4px #4A1520,
      0 0 0 6px #C4A35A,
      0 0 0 8px #4A1520,
      0 25px 60px rgba(0, 0, 0, 0.5);
    animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    overflow: visible;
  }

  /* Borda pontilhada dourada interna */
  .invitation-card::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1.5px dashed rgba(180, 148, 78, 0.45);
    border-radius: 0.6rem;
    pointer-events: none;
    z-index: 2;
  }

  /* ==============================
     CONTEÚDO PRINCIPAL
     ============================== */
  .card-content {
    position: relative;
    z-index: 3;
    padding: 1.5rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ==============================
     MEDALHÃO + CORDA
     ============================== */
  .medallion-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .medallion-area img {
    width: 90px;
    height: auto;
    animation: gentleSwing 5s ease-in-out infinite;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
  }

  /* ==============================
     BANNER FITA CURVADA
     ============================== */
  .ribbon-banner {
    position: relative;
    margin: 0.5rem 0 0.75rem;
    padding: 0.6rem 2.5rem;
    background: linear-gradient(135deg, #5C1A1B 0%, #722F37 50%, #5C1A1B 100%);
    text-align: center;
    clip-path: polygon(
      0% 20%, 4% 0%, 96% 0%, 100% 20%,
      100% 80%, 96% 100%, 4% 100%, 0% 80%
    );
    box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  }

  /* Costura do banner */
  .ribbon-banner::after {
    content: '';
    position: absolute;
    inset: 5px 12px;
    border: 1px dashed rgba(196, 163, 90, 0.35);
    clip-path: polygon(
      0% 15%, 3% 0%, 97% 0%, 100% 15%,
      100% 85%, 97% 100%, 3% 100%, 0% 85%
    );
    pointer-events: none;
  }

  .ribbon-text {
    font-family: 'Rye', cursive;
    font-size: 0.55rem;
    color: #F2E4D0;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  }

  /* ==============================
     TÍTULO PRINCIPAL
     ============================== */
  .title-block {
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .title-main {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    color: #5C1A1B;
    letter-spacing: 0.06em;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .title-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: #8B5E3C;
    font-style: italic;
    margin: 0.15rem 0;
  }

  .baby-name {
    font-family: 'Rye', cursive;
    font-size: 4rem;
    color: #5C1A1B;
    letter-spacing: 0.08em;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(92, 26, 27, 0.15);
    margin: 0.15rem 0 0.5rem;
  }

  /* ==============================
     ORNAMENTO DIVISOR
     ============================== */
  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin: 0.25rem 0;
    width: 100%;
  }

  .divider-line {
    height: 1px;
    flex: 1;
    max-width: 80px;
    background: linear-gradient(90deg, transparent, #C4A35A, transparent);
  }

  .divider-diamond {
    width: 6px;
    height: 6px;
    background: #C4A35A;
    transform: rotate(45deg);
    flex-shrink: 0;
  }

  /* ==============================
     MENSAGEM DE PRESENTES
     ============================== */
  .gift-message {
    text-align: center;
    margin: 0.5rem 0 0.75rem;
    padding: 0 0.5rem;
  }

  .gift-message p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    color: #4A3728;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.02em;
  }

  .gift-message .highlight {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.95rem;
    letter-spacing: 0.06em;
  }

  .gift-message .secondary {
    font-size: 0.85rem;
    font-weight: 500;
    color: #6B4A3A;
    font-style: italic;
    margin-top: 0.25rem;
  }

  /* ==============================
     CAIXAS DE INFORMAÇÃO (endereço, data, horário)
     ============================== */
  .info-boxes {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.75rem 0;
    width: 100%;
  }

  .info-box {
    flex: 1;
    max-width: 130px;
    background: rgba(92, 26, 27, 0.08);
    border: 1px solid rgba(180, 148, 78, 0.3);
    border-radius: 0.4rem;
    padding: 0.75rem 0.5rem 0.5rem;
    text-align: center;
    position: relative;
  }

  .info-box-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5C1A1B, #722F37);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -1.25rem auto 0.4rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    font-size: 0.8rem;
    color: #F2E4D0;
    border: 2px solid #C4A35A;
  }

  .info-box-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem;
    color: #5C1A1B;
    font-weight: 700;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* ==============================
     ILUSTRAÇÕES BOTTOM
     ============================== */
  .bottom-illustrations {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: calc(100% + 1rem);
    margin: 0 -0.5rem -0.5rem;
    padding: 0;
    pointer-events: none;
  }

  .illust-left,
  .illust-right {
    width: 120px;
    flex-shrink: 0;
  }

  .illust-left img,
  .illust-right img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.12));
    animation: fadeIn 0.8s ease-out 0.3s both;
  }

  .illust-right img {
    animation-delay: 0.5s;
  }

  /* ==============================
     SEPARADOR CONVITE → FORMULÁRIO
     ============================== */
  .form-separator {
    text-align: center;
    margin: 1.25rem 0 0.75rem;
    position: relative;
  }

  .form-separator-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, #C4A35A 30%, #C4A35A 70%, transparent);
    margin-bottom: 0.5rem;
  }

  .form-separator-text {
    font-family: 'Rye', cursive;
    font-size: 0.55rem;
    color: #5C1A1B;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: linear-gradient(135deg, #F2E4D0, #EDD9C1);
    padding: 0 0.75rem;
    position: relative;
  }

  /* ==============================
     FORMULÁRIO
     ============================== */
  .form-area {
    width: 100%;
    margin-top: 0.25rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    font-family: 'Rye', cursive;
    font-size: 0.55rem;
    color: #5C1A1B;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 0.875rem;
    border: 1.5px solid #D4C4A8;
    border-radius: 0.4rem;
    font-size: 1rem;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);
    background: rgba(255,255,255,0.6);
    color: #4A3728;
  }

  .form-input::placeholder {
    color: #B8A89A;
    font-style: italic;
  }

  .form-input:focus {
    outline: none;
    border-color: #C4A35A;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 0 0 3px rgba(196, 163, 90, 0.12);
  }

  /* Companions */
  .companions-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .companions-field {
    width: 80px;
    flex-shrink: 0;
    text-align: center;
  }

  .companions-label {
    color: #8B5E3C;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-style: italic;
    font-weight: 500;
  }

  /* ==============================
     OPÇÕES CONFIRMAÇÃO
     ============================== */
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.875rem;
    border: 1.5px solid #D4C4A8;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);
    background: rgba(255,255,255,0.5);
  }

  .option-item:hover {
    border-color: #C4A35A;
    background: rgba(255,255,255,0.7);
  }

  .option-item.selected-yes {
    border-color: #5C1A1B;
    background: rgba(92, 26, 27, 0.06);
  }

  .option-item.selected-maybe {
    border-color: #C4A35A;
    background: rgba(196, 163, 90, 0.08);
  }

  .option-item.selected-no {
    border-color: #8B5E3C;
    background: rgba(139, 94, 60, 0.06);
  }

  .option-radio {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #C4A35A;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    background: rgba(255,255,255,0.7);
    transition: all 200ms;
    position: relative;
  }

  .option-radio:checked {
    border-color: #5C1A1B;
    background: #5C1A1B;
    box-shadow: inset 0 0 0 3px rgba(255,255,255,0.8);
  }

  .option-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    cursor: pointer;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    color: #4A3728;
    font-size: 0.95rem;
  }

  .option-emoji {
    font-size: 1.1rem;
  }

  /* ==============================
     BOTÃO CONFIRMAR
     ============================== */
  .confirm-btn {
    width: 100%;
    padding: 0.85rem 1.25rem;
    margin-top: 1.25rem;
    background: linear-gradient(135deg, #5C1A1B 0%, #722F37 50%, #5C1A1B 100%);
    color: #F2E4D0;
    border: none;
    border-radius: 0.4rem;
    font-family: 'Rye', cursive;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 4px 15px rgba(92, 26, 27, 0.35);
    position: relative;
  }

  .confirm-btn::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(196, 163, 90, 0.3);
    border-radius: 0.25rem;
    pointer-events: none;
  }

  .confirm-btn:hover {
    background: linear-gradient(135deg, #722F37 0%, #8B3A42 50%, #722F37 100%);
    box-shadow: 0 6px 20px rgba(92, 26, 27, 0.45);
    transform: translateY(-1px);
  }

  .confirm-btn:active {
    transform: translateY(0) scale(0.98);
  }

  .confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* ==============================
     RODAPÉ ORNAMENTO
     ============================== */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1rem;
  }

  .footer-ln {
    height: 1px;
    width: 30px;
    background: linear-gradient(90deg, transparent, #C4A35A, transparent);
  }

  .footer-star {
    color: #C4A35A;
    font-size: 0.55rem;
  }

  /* ==============================
     SUCCESS SCREEN
     ============================== */
  .success-overlay {
    position: fixed;
    inset: 0;
    background-color: #4A1520;
    background-image:
      linear-gradient(0deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 24px 24px, 24px 24px, 12px 12px, 12px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    z-index: 50;
  }

  .success-box {
    background: linear-gradient(170deg, #F7EDDF 0%, #F2E4D0 50%, #EDD9C1 100%);
    border-radius: 1rem;
    box-shadow:
      0 0 0 4px #4A1520,
      0 0 0 6px #C4A35A,
      0 0 0 8px #4A1520,
      0 20px 50px rgba(0,0,0,0.5);
    padding: 2.5rem 2rem;
    text-align: center;
    max-width: 400px;
    animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
  }

  .success-box::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1.5px dashed rgba(180, 148, 78, 0.4);
    border-radius: 0.6rem;
    pointer-events: none;
  }

  .success-badge {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.25rem;
    background: linear-gradient(135deg, #5C1A1B, #722F37);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow:
      0 0 0 3px #C4A35A,
      0 6px 20px rgba(92, 26, 27, 0.3);
  }

  .success-h2 {
    font-family: 'Rye', cursive;
    font-size: 1.5rem;
    color: #5C1A1B;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .success-p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    color: #4A3728;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }

  .success-small {
    font-family: 'Cormorant Garamond', serif;
    color: #8B5E3C;
    font-size: 0.95rem;
    font-style: italic;
  }

  /* ==============================
     RESPONSIVE
     ============================== */
  @media (max-width: 480px) {
    .card-content {
      padding: 1.25rem 1.25rem 1.5rem;
    }

    .title-main {
      font-size: 1.6rem;
    }

    .baby-name {
      font-size: 3rem;
    }

    .illust-left,
    .illust-right {
      width: 95px;
    }

    .info-boxes {
      gap: 0.35rem;
    }

    .info-box {
      padding: 0.6rem 0.35rem 0.4rem;
    }

    .info-box-text {
      font-size: 0.65rem;
    }

    .ribbon-banner {
      padding: 0.5rem 1.5rem;
    }

    .ribbon-text {
      font-size: 0.5rem;
    }
  }

  @media (max-width: 360px) {
    .baby-name {
      font-size: 2.5rem;
    }

    .title-main {
      font-size: 1.4rem;
    }

    .illust-left,
    .illust-right {
      width: 80px;
    }
  }
`;

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [numberOfCompanions, setNumberOfCompanions] = useState("0");
  const [confirmationStatus, setConfirmationStatus] = useState<"yes" | "no" | "maybe">("yes");
  const [submitted, setSubmitted] = useState(false);

  const submitConfirmation = trpc.confirmations.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Presença confirmada com sucesso!");
      setTimeout(() => {
        setFullName("");
        setNumberOfCompanions("0");
        setConfirmationStatus("yes");
        setSubmitted(false);
      }, 4000);
    },
    onError: (error) => {
      toast.error("Erro ao confirmar presença. Tente novamente.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Por favor, insira seu nome completo");
      return;
    }
    submitConfirmation.mutate({
      fullName: fullName.trim(),
      numberOfCompanions: parseInt(numberOfCompanions, 10),
      confirmationStatus,
    });
  };

  /* ---------- SUCCESS ---------- */
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="success-overlay">
          <div className="success-box">
            <div className="success-badge">🤠</div>
            <h2 className="success-h2">Yeehaw!</h2>
            <p className="success-p">{fullName}, sua presença foi registrada.</p>
            <p className="success-small">Nos vemos no chá de fralda do Eze! 🐴</p>
            <div className="card-footer">
              <span className="footer-ln"></span>
              <span className="footer-star">★</span>
              <span className="footer-ln"></span>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ---------- INVITATION + FORM ---------- */
  return (
    <>
      <style>{styles}</style>
      <div className="invitation-page">
        <div className="invitation-card">
          <div className="card-content">

            {/* ─── Medalhão pendurado ─── */}
            <div className="medallion-area">
              <img src="/images/medallion.png" alt="Medalhão vintage" />
            </div>

            {/* ─── Banner fita curvada ─── */}
            <div className="ribbon-banner">
              <p className="ribbon-text">Você está convidado para o</p>
            </div>

            {/* ─── Título principal ─── */}
            <div className="title-block">
              <h1 className="title-main">Chá de Bebê</h1>
              <p className="title-sub">do</p>
              <p className="baby-name">EZE</p>
            </div>

            {/* ─── Divisor ─── */}
            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-diamond"></span>
              <span className="divider-line"></span>
            </div>

            {/* ─── Mensagem de presentes ─── */}
            <div className="gift-message">
              <p className="highlight">
                Com carinho, sugerimos fraldas<br />
                tamanho M ou G.
              </p>
              <p className="secondary">
                E, se sentirem-se à vontade, um mimo<br />
                será muito especial!
              </p>
            </div>

            {/* ─── Caixas de informação ─── */}
            <div className="info-boxes">
              <div className="info-box">
                <div className="info-box-icon">📍</div>
                <p className="info-box-text">Rua do Leão,<br/>92 - Estrela<br/>Dalva</p>
              </div>
              <div className="info-box">
                <div className="info-box-icon">📅</div>
                <p className="info-box-text">13 de<br/>Junho<br/>2026</p>
              </div>
              <div className="info-box">
                <div className="info-box-icon">🕐</div>
                <p className="info-box-text">Às<br/>15h00</p>
              </div>
            </div>

            {/* ─── Ilustrações bottom ─── */}
            <div className="bottom-illustrations">
              <div className="illust-left">
                <img src="/images/teddy-bear.png" alt="Ursinho vintage" />
              </div>
              <div className="illust-right">
                <img src="/images/rocking-horse.png" alt="Cavalinho de balanço" />
              </div>
            </div>

            {/* ═══════════════════════════════════
                FORMULÁRIO DE CONFIRMAÇÃO
                ═══════════════════════════════════ */}
            <div className="form-separator">
              <div className="form-separator-line"></div>
              <span className="form-separator-text">Confirme sua presença</span>
            </div>

            <div className="form-area">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Digite seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitConfirmation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Acompanhantes</label>
                  <div className="companions-row">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="form-input companions-field"
                      value={numberOfCompanions}
                      onChange={(e) => setNumberOfCompanions(e.target.value)}
                      disabled={submitConfirmation.isPending}
                    />
                    <span className="companions-label">
                      {numberOfCompanions === "0"
                        ? "Apenas você"
                        : `+ ${numberOfCompanions} ${numberOfCompanions === "1" ? "acompanhante" : "acompanhantes"}`}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sua Resposta</label>
                  <div className="options-list">
                    <div
                      className={`option-item ${confirmationStatus === "yes" ? "selected-yes" : ""}`}
                      onClick={() => !submitConfirmation.isPending && setConfirmationStatus("yes")}
                    >
                      <input
                        type="radio" name="confirmation" value="yes" id="opt-yes"
                        className="option-radio"
                        checked={confirmationStatus === "yes"}
                        onChange={() => setConfirmationStatus("yes")}
                        disabled={submitConfirmation.isPending}
                      />
                      <label htmlFor="opt-yes" className="option-label">
                        <span className="option-emoji">🤠</span>
                        <span>Sim, estarei lá!</span>
                      </label>
                    </div>

                    <div
                      className={`option-item ${confirmationStatus === "maybe" ? "selected-maybe" : ""}`}
                      onClick={() => !submitConfirmation.isPending && setConfirmationStatus("maybe")}
                    >
                      <input
                        type="radio" name="confirmation" value="maybe" id="opt-maybe"
                        className="option-radio"
                        checked={confirmationStatus === "maybe"}
                        onChange={() => setConfirmationStatus("maybe")}
                        disabled={submitConfirmation.isPending}
                      />
                      <label htmlFor="opt-maybe" className="option-label">
                        <span className="option-emoji">🤔</span>
                        <span>Talvez, ainda não sei</span>
                      </label>
                    </div>

                    <div
                      className={`option-item ${confirmationStatus === "no" ? "selected-no" : ""}`}
                      onClick={() => !submitConfirmation.isPending && setConfirmationStatus("no")}
                    >
                      <input
                        type="radio" name="confirmation" value="no" id="opt-no"
                        className="option-radio"
                        checked={confirmationStatus === "no"}
                        onChange={() => setConfirmationStatus("no")}
                        disabled={submitConfirmation.isPending}
                      />
                      <label htmlFor="opt-no" className="option-label">
                        <span className="option-emoji">😢</span>
                        <span>Não poderei ir</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitConfirmation.isPending}
                  className="confirm-btn"
                >
                  {submitConfirmation.isPending ? "Confirmando..." : "Confirmar Presença"}
                </button>
              </form>

              <div className="card-footer">
                <span className="footer-ln"></span>
                <span className="footer-star">★</span>
                <span className="footer-ln"></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
