import "../../styles/ui/Header.css";

export interface HeaderProps {
  pageTitle: string;
  actions: React.ReactNode;
  tabs: React.ReactNode;
}

export default function Header({ pageTitle, tabs, actions }: HeaderProps) {
  return (
    <div className="base-header">
      <h4 className="title">{pageTitle}</h4>
      <div className="control-bar">
        <div>{tabs}</div>
        <div>{actions}</div>
      </div>
    </div>
  );
}
