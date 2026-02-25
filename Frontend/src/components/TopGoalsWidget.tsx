import "./topGoalsWidget.css";

function TopGoalsWidget() {
  return (
    <div className="topGoalsWidgetDiv">
      <h3>Top goals</h3>
      <div className="goalsContainer">
        <div className="goal">
          <p className="goalName">Учеба</p>
          <p className="goalPercent">50%</p>
        </div>
        <div className="goal">
          <p className="goalName">Гитара</p>
          <p className="goalPercent">25%</p>
        </div>
        <div className="goal">
          <p className="goalName">Баскетбол</p>
          <p className="goalPercent">25%</p>
        </div>
      </div>
    </div>
  );
}

export default TopGoalsWidget;
