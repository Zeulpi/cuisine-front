import { useAppSelector as appSelector } from '../store/reducers/store'

export function getServerTime() {
  const [day, month, year] = (appSelector(state => state.auth.serverTime)).split('-');
  const serverTimeDate = new Date(`${year}-${month}-${day}`);
  serverTimeDate.setHours(0,0,0,0);
  return serverTimeDate;
}

export function compareDates(currentDate, plannerStart, dayIndex=0) {
  const [day, month, year] = plannerStart.split('-');
  const plannerDate = new Date(`${year}-${month}-${day}`);
  plannerDate.setDate(plannerDate.getDate() + dayIndex);

  return (currentDate <= plannerDate);
}