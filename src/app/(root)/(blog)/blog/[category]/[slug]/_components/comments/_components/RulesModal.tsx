import { useState } from "react";
import Link from "next/link";
import { Shield, X } from "lucide-react";

export const RulesModal = ({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-success" />
            <h2 className="text-2xl font-semibold">Правила сообщества</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-subtle rounded-full "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="bg-success-soft p-4 rounded">
              <p className="text-success">
                Пожалуйста, ознакомьтесь с правилами сообщества перед тем, как
                оставлять комментарии.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Основные правила:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-success">✓</span>
                  Уважайте других участников
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span>
                  Запрещены оскорбления и травля
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span>
                  Никакого спама и рекламы
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span>
                  Пишите конструктивно и по теме
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span>
                  Не публикуйте запрещенный контент
                </li>
              </ul>
            </div>

            <div className="bg-surface p-4 rounded">
              <p className="text-sm text-muted-foreground">
                Нарушение правил может привести к временной или постоянной
                блокировке аккаунта.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/blog/rules"
                className="text-success hover:text-success text-sm"
                onClick={onClose}
              >
                Читать полную версию правил →
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-surface">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground"
            >
              Закрыть
            </button>
            <button
              onClick={() => {
                if (accepted) {
                  onAccept();
                  onClose();
                }
              }}
              disabled={!accepted}
              className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Принимаю правила
            </button>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <input
                type="checkbox"
                id="accept-rules-modal"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="rounded text-success cursor-pointer"
              />
              <label
                htmlFor="accept-rules-modal"
                className="text-sm text-muted-foreground"
              >
                Я ознакомился и принимаю правила сообщества
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
