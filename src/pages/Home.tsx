import PageCore from "../ui/PageCore";

export default function Home() {
  return (
    <PageCore pageTitle="Home" className="home">
      <h5>Welcome to Super Awesome Budget Tool.</h5>
      <small>Or probably something else. Name is work in progress. So is everything else.</small>
      <p>
        A <strong>tool</strong> used to turn a financial picture into a budget.
      </p>
    </PageCore>
  );
}
