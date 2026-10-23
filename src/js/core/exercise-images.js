/**
 * Fotografias demonstrativas do acervo aberto free-exercise-db.
 * As correspondências são explícitas para evitar exibir um movimento errado.
 * Sem conexão, os cards mantêm um estado acessível e um link de consulta.
 */
const DATA_URL='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const PHOTO_ROOT='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const LABELS=[
 ['panturrilha',['Standing Calf Raises','Calf Raises - Machine Seated','Standing Calf Raises - Machine']],
 ['passada livre',['Walking Lunge','Dumbbell Lunges','Barbell Lunge']],
 ['extensora',['Leg Extensions','Leg Extension']],
 ['cadeira flexora',['Seated Leg Curl','Seated Leg Curls','Lying Leg Curls']],
 ['mesa flexora',['Lying Leg Curls','Lying Leg Curl']],
 ['agachamento livre',['Barbell Squat','Barbell Full Squat']],
 ['leg press',['Leg Press']],
 ['remada baixa',['Seated Cable Rows','Seated Cable Row']],
 ['puxada supinada',['Underhand Cable Pulldowns','Close-Grip Front Lat Pulldown']],
 ['puxada alta',['Wide-Grip Lat Pulldown','Wide-Grip Pulldown Behind The Neck']],
 ['facepull',['Face Pull','Face Pulls']],
 ['bíceps concentrado',['Concentration Curls','Concentration Curl']],
 ['abdominal infra',['Hanging Leg Raise','Hanging Leg Raises']],
 ['cadeira abdutora',['Thigh Abductor','Hip Abduction']],
 ['búlgaro',['Single Leg Split Squat','Dumbbell Bulgarian Split Squat','Split Squat with Dumbbells']],
 ['stiff',['Stiff-Legged Barbell Deadlift','Stiff-Legged Dumbbell Deadlift']],
 ['elevação pélvica',['Barbell Hip Thrust','Barbell Glute Bridge']],
 ['flexora em pé',['Standing Leg Curl','Standing Leg Curls']],
 ['voador',['Butterfly','Machine Bench Press']],
 ['desenvolvimento',['Dumbbell Shoulder Press','Seated Dumbbell Press']],
 ['lateral com halteres',['Side Lateral Raise','Dumbbell Lateral Raise']],
 ['terra romeno',['Romanian Deadlift','Barbell Romanian Deadlift']],
 ['passada ou afundo',['Dumbbell Lunges','Walking Lunge']],
 ['abdução de quadril',['Thigh Abductor','Hip Abduction']],
 ['supino máquina ou halteres',['Dumbbell Bench Press','Machine Bench Press']],
 ['puxada na frente',['Wide-Grip Lat Pulldown']],
 ['rosca bíceps',['Dumbbell Bicep Curl','Standing Dumbbell Curl']],
 ['tríceps na polia',['Triceps Pushdown','Triceps Pushdown - Rope Attachment']],
 ['agachamento (variação confortável)',['Barbell Squat']],
 ['cadeira extensora',['Leg Extensions']],
 ['abdutora',['Thigh Abductor']],
 ['good morning',['Good Morning']],
 ['flexora sentada',['Seated Leg Curl']],
 ['pull-through',['Pull Through','Cable Pull Through']]
];
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
let catalogPromise;
function catalog(){return catalogPromise??=fetch(DATA_URL,{mode:'cors'}).then(r=>{if(!r.ok)throw Error('Catálogo indisponível');return r.json()}).catch(()=>[])}
function namesFor(name){const key=norm(name);return LABELS.find(([label])=>key.startsWith(norm(label)))?.[1]||[]}
function photo(exercises,name){const choices=namesFor(name);for(const label of choices){const item=exercises.find(e=>norm(e.name)===norm(label)&&e.images?.[0]);if(item)return PHOTO_ROOT+item.images[0].split('/').map(encodeURIComponent).join('/')}return null}
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** Atualiza apenas imagens, sem re-renderizar inputs de carga nem perder foco. */
export async function populateExerciseImages(root=document){const targets=[...root.querySelectorAll('[data-exercise-photo]')];if(!targets.length)return;const items=await catalog();for(const target of targets){if(!target.isConnected)continue;const name=target.dataset.exercisePhoto;const src=photo(items,name);if(!src){target.innerHTML='<span class="exercise-photo-placeholder" aria-hidden="true">▧</span>';continue}const img=document.createElement('img');img.alt='Demonstração de '+name;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.onerror=()=>{target.innerHTML='<span class="exercise-photo-placeholder" aria-hidden="true">▧</span>'};img.src=src;target.replaceChildren(img)}}
export function photoMarkup(name){return '<span class="exercise-photo" data-exercise-photo="'+escapeHtml(name)+'" role="img" aria-label="Imagem ilustrativa de '+escapeHtml(name)+'"><span class="exercise-photo-placeholder" aria-hidden="true">▧</span></span>'}
