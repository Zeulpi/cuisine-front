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

export const getDayIndex = () =>{
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let dayIndex = currentDate.getDay() - 1;
  if (dayIndex === -1) {
    dayIndex = 6;
  }
  return dayIndex;
}

export const daysOfWeek = [
  { day: "Lundi", keyM: "monM", keyE: "monE" },   // Lundi midi et soir
  { day: "Mardi", keyM: "tueM", keyE: "tueE" },   // Mardi midi et soir
  { day: "Mercredi", keyM: "wedM", keyE: "wedE" }, // Mercredi midi et soir
  { day: "Jeudi", keyM: "thuM", keyE: "thuE" },   // Jeudi midi et soir
  { day: "Vendredi", keyM: "friM", keyE: "friE" }, // Vendredi midi et soir
  { day: "Samedi", keyM: "satM", keyE: "satE" },   // Samedi midi et soir
  { day: "Dimanche", keyM: "sunM", keyE: "sunE" }, // Dimanche midi et soir
]