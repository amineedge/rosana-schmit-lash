import test from 'node:test';
import assert from 'node:assert/strict';
import {reserve,cancelBooking,slots,confirmRefund,demoDays,monthCells} from '../booking-model.js';
const fresh=()=>({bookings:[],closed:[],waitlist:[]});
const input={name:'Cliente teste',date:'2030-01-10',time:'09:00',service:'full'};
test('calendar spans months and years, respects leap days and booking window',()=>{
 const now=new Date('2026-12-20T23:30:00-03:00');
 const days=demoDays(now,60);
 assert.equal(days[0],'2026-12-21');assert.equal(days.at(-1),'2027-02-18');
 assert(monthCells('2028-02').includes('2028-02-29'));
 assert(!monthCells('2027-02').includes('2027-02-29'));
 assert.equal(monthCells('2026-11')[0],null);
 assert.throws(()=>reserve({...fresh(),bookingWindowDays:30},{...input,date:'2027-02-18'},now));
});
test('reservation blocks its complete duration and rejects conflicts',()=>{
 const s=reserve(fresh(),input);
 assert(!slots(s,input.date,'maintenance').some(x=>['09:00','09:30','10:00','10:30'].includes(x.time)));
 assert.throws(()=>reserve(s,{...input,time:'10:30'}));
 assert(slots(s,input.date,'maintenance').find(x=>x.time==='11:00').recommended);
});
test('late deposit is retained and refunded only after full replacement',()=>{
 let s=reserve(fresh(),input);
 const id=s.bookings[0].id;
 s=cancelBooking(s,id,{now:new Date('2030-01-10T07:00:00-03:00')});
 assert.equal(s.bookings[0].financial,'retained');
 const partial=reserve(s,{...input,service:'maintenance'});
 assert.equal(partial.bookings[0].financial,'retained');
 const complete=reserve(s,input);
 assert.equal(complete.bookings[0].financial,'refund_processing');
 assert.equal(confirmRefund(complete,id).bookings[0].financial,'refunded');
 assert.equal(confirmRefund(s,id).bookings[0].financial,'retained');
});
test('early cancellations credit, legal refunds override, and closed days block bookings',()=>{
 let s=reserve(fresh(),input);const id=s.bookings[0].id;
 assert.equal(cancelBooking(s,id,{now:new Date('2030-01-08T09:00:00-03:00')}).bookings[0].financial,'credit');
 assert.equal(cancelBooking(s,id,{legalRefund:true}).bookings[0].financial,'refund_processing');
 s.closed.push(input.date);assert.equal(slots(s,input.date,'full').length,0);
});
