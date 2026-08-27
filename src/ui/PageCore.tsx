import Header from "./Header";

export default function PageCore({
  children,
  pageTitle,
  actions = null,
  tabs = null,
  className,
}: {
  children: React.ReactNode;
  pageTitle: string;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  className: string;
}) {
  return (
    <div className="page-core">
      <Header pageTitle={pageTitle} actions={actions} tabs={tabs} />
      <div className={className}>{children}</div>
    </div>
  );
}
