import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {OAuth2Client} from 'google-auth-library';
import rateLimit from 'express-rate-limit';

const {MONGODB_URI,GOOGLE_CLIENT_ID,FRONTEND_ORIGIN,PORT='3000'}=process.env;
if(!MONGODB_URI||!GOOGLE_CLIENT_ID||!FRONTEND_ORIGIN){console.error('Configure MONGODB_URI, GOOGLE_CLIENT_ID e FRONTEND_ORIGIN.');process.exit(1)}
const google=new OAuth2Client(GOOGLE_CLIENT_ID);
const app=express();
app.disable('x-powered-by');
app.use(cors({origin:FRONTEND_ORIGIN.split(',').map(s=>s.trim()),methods:['GET','POST','OPTIONS'],allowedHeaders:['Authorization','Content-Type']}));
app.use(express.json({limit:'1mb'}));
app.use('/api',rateLimit({windowMs:60_000,limit:90,standardHeaders:'draft-7',legacyHeaders:false}));
const recordSchema=new mongoose.Schema({sub:{type:String,required:true,unique:true,index:true},history:{type:[mongoose.Schema.Types.Mixed],default:[]},deletedIds:{type:[String],default:[]},preferences:{type:mongoose.Schema.Types.Mixed,default:{}},updatedAt:{type:Date,default:Date.now}},{versionKey:false,strict:true});
const Record=mongoose.model('RitmoAccount',recordSchema);
async function authenticate(req,res,next){try{const token=req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];if(!token)return res.status(401).json({error:'Autenticação necessária'});const info=await google.getTokenInfo(token);if(info.aud!==GOOGLE_CLIENT_ID)return res.status(401).json({error:'Token destinado a outro aplicativo'});const response=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:'Bearer '+token}});if(!response.ok)return res.status(401).json({error:'Token inválido'});const profile=await response.json();if(!profile.sub)return res.status(401).json({error:'Identidade inválida'});req.sub=profile.sub;next()}catch{return res.status(401).json({error:'Token inválido ou expirado'})}}
const validHistory=x=>Array.isArray(x)&&x.length<=5000&&x.every(s=>s&&typeof s.id==='string'&&s.id.length<=120&&Number.isFinite(s.start)&&Number.isFinite(s.end)&&Array.isArray(s.done)&&Array.isArray(s.weights)&&s.weights.length<=80&&s.done.length<=80);
const validIds=x=>Array.isArray(x)&&x.length<=5000&&x.every(id=>typeof id==='string'&&id.length<=120);
function merge(a,b,deleted){const map=new Map();for(const item of [...a,...b]){if(deleted.has(item.id))continue;const old=map.get(item.id);if(!old||(item.updatedAt||item.end||0)>(old.updatedAt||old.end||0))map.set(item.id,item)}return [...map.values()].sort((x,y)=>y.start-x.start).slice(0,5000)}
app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
app.get('/api/sync',authenticate,async(req,res,next)=>{try{const doc=await Record.findOne({sub:req.sub}).lean();res.set('Cache-Control','no-store');res.json({history:doc?.history||[],deletedIds:doc?.deletedIds||[],preferences:doc?.preferences||{},updatedAt:doc?.updatedAt||null})}catch(e){next(e)}});
app.post('/api/sync',authenticate,async(req,res,next)=>{try{const {history=[],deletedIds=[],preferences={}}=req.body||{};if(!validHistory(history)||!validIds(deletedIds)||!preferences||typeof preferences!=='object'||Array.isArray(preferences)||JSON.stringify(preferences).length>100000)return res.status(400).json({error:'Dados inválidos'});let result;for(let attempt=0;attempt<4;attempt++){const current=await Record.findOne({sub:req.sub});const deleted=new Set([...(current?.deletedIds||[]),...deletedIds]);const merged=merge(current?.history||[],history,deleted);const update={history:merged,deletedIds:[...deleted].slice(-5000),preferences:Object.keys(preferences).length?preferences:(current?.preferences||{}),updatedAt:new Date()};if(current){result=await Record.findOneAndUpdate({_id:current._id,updatedAt:current.updatedAt},{$set:update},{new:true});if(result)break}else{try{result=await Record.create({sub:req.sub,...update});break}catch(e){if(e.code!==11000)throw e}}}if(!result)return res.status(409).json({error:'Conflito de sincronização, tente novamente'});res.set('Cache-Control','no-store');res.json({history:result.history,deletedIds:result.deletedIds,preferences:result.preferences})}catch(e){next(e)}});
app.use((err,req,res,next)=>{console.error('API error',err.message);res.status(500).json({error:'Erro interno da API'})});
await mongoose.connect(MONGODB_URI,{serverSelectionTimeoutMS:12000});
app.listen(Number(PORT),'0.0.0.0',()=>console.log('Ritmo API pronta na porta '+PORT));
