export const services = {
  full: { name: 'Extensão de cílios', minutes: 120, price: 150, deposit: 50 },
  maintenance: { name: 'Manutenção', minutes: 60, price: 90, deposit: 30 },
  lifting: { name: 'Lash Lifting', minutes: 90, price: 130, deposit: 40 },
};
export function dateKey(date) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function demoDays(now = new Date(), count = 60) {
  const today=dateKey(now);
  const base=new Date(`${today}T12:00:00-03:00`);
  return Array.from({length:count}, (_,i) => dateKey(new Date(base.getTime()+(i+1)*86400000)));
}
export function monthCells(month){
  const [year,number]=month.split('-').map(Number);
  const start=new Date(Date.UTC(year,number-1,1));
  const offset=(start.getUTCDay()+6)%7;
  const count=new Date(Date.UTC(year,number,0)).getUTCDate();
  return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)];
}
const minutes = time => Number(time.slice(0,2))*60+Number(time.slice(3));
export function slots(state, date, service) {
  if (state.closed.includes(date)) return [];
  const duration = services[service].minutes;
  const busy = state.bookings.filter(b => b.date===date && b.status==='confirmed');
  return Array.from({length:17},(_,i)=>540+i*30).filter(start=> start+duration<=1080 && !busy.some(b=>start<minutes(b.time)+services[b.service].minutes && start+duration>minutes(b.time))).map(start=>({
    time:`${String(Math.floor(start/60)).padStart(2,'0')}:${String(start%60).padStart(2,'0')}`,
    recommended:busy.some(b=>start===minutes(b.time)+services[b.service].minutes || start+duration===minutes(b.time)),
  })).sort((a,b)=>Number(b.recommended)-Number(a.recommended)||a.time.localeCompare(b.time));
}
export function reserve(state, input, now = new Date()) {
  if(state.bookingWindowDays && !demoDays(now,state.bookingWindowDays).includes(input.date)) throw new Error('Esta data está fora do período de reservas. Escolha uma data disponível.');
  if (!input.name.trim() || !slots(state,input.date,input.service).some(s=>s.time===input.time)) throw new Error('Este horário não está mais disponível. Escolha outro.');
  const booking = {...input,id:crypto.randomUUID(),createdAt:now.toISOString(),status:'confirmed',financial:'deposit',events:[{at:now.toISOString(),text:'Sinal recebido na simulação. Reserva confirmada.'}]};
  const bookings = [...state.bookings, booking].map(b => b.status==='cancelled' && b.date===input.date && b.time===input.time && b.financial==='retained' && services[input.service].minutes>=services[b.service].minutes ? {...b,financial:b.refundChoice==='credit'?'credit':'refund_processing',reason:b.refundChoice==='credit'?'Horário preenchido por outra cliente. Crédito liberado para outra data.':'Horário preenchido por outra cliente. Reembolso em processamento; aguardando confirmação do pagamento.',events:[...b.events,{at:now.toISOString(),text:'Horário preenchido. '+(b.refundChoice==='credit'?'Crédito liberado.':'Reembolso solicitado, ainda não confirmado.') }]} : b);
  return {...state,bookings};
}
export function cancelBooking(state,id,{now=new Date(),legalRefund=false,choice='refund'}={}) {
  return {...state,bookings:state.bookings.map(b=>{
    if(b.id!==id || b.status!=='confirmed') return b;
    const hours=(new Date(`${b.date}T${b.time}:00-03:00`)-now)/3600000;
    const financial=legalRefund?'refund_processing':hours>=24?'credit':'retained';
    const reason=legalRefund?'Reembolso legal autorizado. Aguardando confirmação do pagamento.':financial==='credit'?'Cancelamento com pelo menos 24h de antecedência. Crédito disponível para outra data.':'Cancelamento com menos de 24h. '+(choice==='credit'?'Crédito':'Reembolso')+' em espera, condicionado ao preenchimento integral do horário. O sinal permanece com Rosana para compensar o tempo reservado.';
    return {...b,status:'cancelled',financial,reason,refundChoice:choice,events:[...b.events,{at:now.toISOString(),text:reason}]};
  })};
}
export function confirmRefund(state,id,now=new Date()) {
  return {...state,bookings:state.bookings.map(b=>b.id===id && b.financial==='refund_processing'?{...b,financial:'refunded',reason:'Reembolso confirmado na simulação. Valor devolvido à cliente.',events:[...b.events,{at:now.toISOString(),text:'Confirmação de reembolso recebida na simulação.'}]}:b)};
}
