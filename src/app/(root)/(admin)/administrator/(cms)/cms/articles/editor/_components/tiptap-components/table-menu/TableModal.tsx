import React from "react";
import { createPortal } from "react-dom";
import { TablePreview } from "./TablePreview";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: number;
  cols: number;
  withHeaderRow: boolean;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onHeaderChange: (withHeader: boolean) => void;
  onInsert: () => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  rows,
  cols,
  withHeaderRow,
  onRowsChange,
  onColsChange,
  onHeaderChange,
  onInsert,
}) => {
  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const stopToolbarDrag = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const preventToolbarDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return createPortal(
    <div
      className="table-modal-overlay"
      draggable={false}
      onPointerDown={stopToolbarDrag}
      onMouseDown={stopToolbarDrag}
      onDragStart={preventToolbarDrop}
      onDragOver={preventToolbarDrop}
      onDrop={preventToolbarDrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="table-modal-content" draggable={false}>
        <div className="table-modal-header">
          <h3 className="table-modal-title">Создать таблицу</h3>
        </div>

        <div className="table-modal-body">
          <div className="table-form-group">
            <label htmlFor="rows" className="table-form-label">
              Количество строк
            </label>
            <div className="table-range-container">
              <input
                id="rows"
                type="range"
                draggable={false}
                min="1"
                max="10"
                value={rows}
                onChange={(e) => onRowsChange(parseInt(e.target.value, 10))}
                className="table-range-input"
              />
              <span className="table-range-value">{rows}</span>
            </div>
          </div>

          <div className="table-form-group">
            <label htmlFor="cols" className="table-form-label">
              Количество столбцов
            </label>
            <div className="table-range-container">
              <input
                id="cols"
                type="range"
                draggable={false}
                min="1"
                max="10"
                value={cols}
                onChange={(e) => onColsChange(parseInt(e.target.value, 10))}
                className="table-range-input"
              />
              <span className="table-range-value">{cols}</span>
            </div>
          </div>

          <div className="table-form-group">
            <div className="table-checkbox-container">
              <input
                id="header"
                type="checkbox"
                draggable={false}
                checked={withHeaderRow}
                onChange={(e) => onHeaderChange(e.target.checked)}
                className="table-checkbox"
              />
              <label htmlFor="header" className="table-checkbox-label">
                Добавить строку заголовка
              </label>
            </div>
          </div>

          <TablePreview rows={rows} cols={cols} withHeaderRow={withHeaderRow} />
        </div>

        <div className="table-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="table-modal-button cancel"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onInsert}
            className="table-modal-button insert"
          >
            Вставить таблицу
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
