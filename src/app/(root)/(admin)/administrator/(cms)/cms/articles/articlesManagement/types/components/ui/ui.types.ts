export interface SubmitSectionProps {
  onCancel: () => void;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface FilterControlsProps {
  onToggleFilters?: (show: boolean) => void;
}
