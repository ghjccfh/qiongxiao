let coinOperationsCurrentPage=1;let coinOperationsPageSize=20;let coinOperationsFilteredData=[];let isBoxOpening=!1;let isSavingItem=!1;let bgMusic=null;let isMusicPlaying=!1;let currentBoxMode=1;let chatMessages=[];let onlineUsers=[];let heartbeatInterval=null;let chatSubscription=null;let onlineUsersSubscription=null;let unreadChatCount=0;window._lastProcessedRoundId=0;window._isLoadingNewRound=!1;function updateChatUnreadBadge(){const badge=document.getElementById('chatUnreadBadge');if(badge){badge.textContent=unreadChatCount;badge.style.display=unreadChatCount>0?'inline-block':'none'}}
function addShakeAnimationStyle(){if(!document.getElementById('shake-animation-style')){const style=document.createElement('style');style.id='shake-animation-style';style.textContent=`
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }
            .box-shake {
                animation: shake 0.1s ease-in-out 3; /* 2秒内震动10次 */
            }
        `;document.head.appendChild(style)}}
function initBackgroundMusic(){if(bgMusic)return;bgMusic=new Audio('race.mp3');bgMusic.loop=!0;bgMusic.preload='auto';bgMusic.volume=0.7;bgMusic.addEventListener('error',(e)=>{console.error('背景音乐加载失败，请检查文件是否存在：race.mp3',e)})}
initBackgroundMusic();function playBgMusic(){if(!bgMusic){initBackgroundMusic()}
if(!isMusicPlaying){bgMusic.play().then(()=>{isMusicPlaying=!0}).catch(err=>console.warn('背景音乐播放被阻止或失败:',err))}}
function pauseBgMusic(){if(bgMusic&&isMusicPlaying){bgMusic.pause();isMusicPlaying=!1}}
function stopBgMusic(){if(bgMusic){bgMusic.pause();bgMusic.currentTime=0;isMusicPlaying=!1}}
const uploadCoverBtn=document.getElementById('uploadCoverBtn');const removeCoverBtn=document.getElementById('removeCoverBtn');const uploadCoverArea=document.getElementById('uploadCoverArea');const coverPreviewContainer=document.getElementById('coverPreviewContainer');const coverPreviewContent=document.getElementById('coverPreviewContent');const itemCoverImageInput=document.getElementById('itemCoverImage');const videoCoverUpload=document.getElementById('videoCoverUpload');let currentCoverFile=null;let currentCoverUrl='';let lastRenderedBoxes=null;let currentPage='home';function formatDateTime(dateString){if(!dateString)return'未知时间';try{let date;if(typeof dateString==='object'&&dateString instanceof Date){date=dateString}else if(typeof dateString==='string'){if(!dateString.includes('Z')&&!dateString.includes('+')&&!dateString.includes('-',10)){date=new Date(dateString+'Z')}else{date=new Date(dateString)}}else{date=new Date(dateString)}
if(isNaN(date.getTime())){return dateString}
return date.toLocaleString('zh-CN',{timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:!1}).replace(/\//g,'-')}catch(error){console.error('时间格式化错误:',error,dateString);return dateString}}(function(){let supabase;if(window.supabaseClient){supabase=window.supabaseClient}else{const SUPABASE_URL='https://arjawmtrszjirgiyncyo.supabase.co';const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyamF3bXRyc3pqaXJnaXluY3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjk1ODUsImV4cCI6MjA4MzcwNTU4NX0.kafmkLkCKTTEB2tBDpU7nVNO9uxTiErXfGpYNKXR4S0';if(window.supabase){supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);window.supabaseClient=supabase}else{console.error('Supabase库未加载！');supabase={from:()=>({select:()=>Promise.resolve({data:[],error:null}),insert:()=>Promise.resolve({error:null}),update:()=>Promise.resolve({error:null}),delete:()=>Promise.resolve({error:null}),upsert:()=>Promise.resolve({error:null}),single:()=>Promise.resolve({data:null,error:{code:'PGRST116'}})}),channel:()=>({on:()=>({subscribe:()=>({})})}),removeChannel:()=>{}}}}
const gameData={currentUser:null,users:[],items:[],userHistory:[],systemSettings:{allowUserRegistration:!0,defaultUserBalance:0,boxCost:10,lastReset:null,adminCanPlay:!1},globalRound:{id:null,round_id:1,boxes:Array(50).fill().map((_,index)=>({id:index+1,isOpened:!1,openedBy:null,itemId:null,presetItemId:null,openedAt:null})),startedAt:new Date().toLocaleString(),completedAt:null,preset_generated:!1}};const loginModal=document.getElementById('loginModal');const loginModalBtn=document.getElementById('loginModalBtn');const closeLoginModal=document.getElementById('closeLoginModal');const loginBtn=document.getElementById('loginBtn');const logoutBtn=document.getElementById('logoutBtn');const resultModal=document.getElementById('resultModal');const closeResultModal=document.getElementById('closeResultModal');const closeResultModalBtn=document.getElementById('closeResultModalBtn');const resultModalContent=document.getElementById('resultModalContent');const resultModalBoxInfo=document.getElementById('resultModalBoxInfo');const resultModalAutoclose=document.getElementById('resultModalAutoclose');const userLoggedOut=document.getElementById('user-logged-out');const userLoggedIn=document.getElementById('user-logged-in');const userName=document.getElementById('userName');const userAvatar=document.getElementById('userAvatar');const adminBadge=document.getElementById('adminBadge');const subadminBadge=document.getElementById('subadminBadge');const adminLink=document.getElementById('admin-link');const adminMenuItem=document.getElementById('admin-menu-item');const profileName=document.getElementById('profileName');const profileEmail=document.getElementById('profileEmail');const profileRole=document.getElementById('profileRole');const profileAvatar=document.getElementById('profileAvatar');const profileApprovalStatus=document.getElementById('profileApprovalStatus');const userBalance=document.getElementById('userBalance');const userBoxesOpened=document.getElementById('userBoxesOpened');const userWarehouse=document.getElementById('userWarehouse');const userLevel=document.getElementById('userLevel');const navLinks=document.querySelectorAll('.nav-link');const sidebarMenuItems=document.querySelectorAll('.sidebar-menu-item');const contentSections=document.querySelectorAll('.content-section');const warehouseContainer=document.getElementById('warehouseContainer');const historyTableBody=document.getElementById('historyTableBody');const adminUsersTable=document.getElementById('adminUsersTable');const adminItemsTable=document.getElementById('adminItemsTable');const addUserBtn=document.getElementById('addUserBtn');const addItemBtn=document.getElementById('addItemBtn');const modifyCoinsBtn=document.getElementById('modifyCoinsBtn');const approveUsersBtn=document.getElementById('approveUsersBtn');const userModal=document.getElementById('userModal');const closeUserModal=document.getElementById('closeUserModal');const saveUserBtn=document.getElementById('saveUserBtn');const itemModal=document.getElementById('itemModal');const closeItemModal=document.getElementById('closeItemModal');const saveItemBtn=document.getElementById('saveItemBtn');const modifyCoinsModal=document.getElementById('modifyCoinsModal');const closeModifyCoinsModal=document.getElementById('closeModifyCoinsModal');const modifyCoinsConfirmBtn=document.getElementById('modifyCoinsConfirmBtn');const coinsUserSelect=document.getElementById('coinsUserSelect');const coinsOperation=document.getElementById('coinsOperation');const userModalTitle=document.getElementById('userModalTitle');const itemModalTitle=document.getElementById('itemModalTitle');const openedBoxesCount=document.getElementById('openedBoxesCount');const remainingBoxesCount=document.getElementById('remainingBoxesCount');const roundProgress=document.getElementById('roundProgress');const blindBoxesGrid=document.getElementById('blindBoxesGrid');const updateProfileBtn=document.getElementById('updateProfileBtn');const resetAllItemsBtn=document.getElementById('resetAllItemsBtn');const resetToDefaultBtn=document.getElementById('resetToDefaultBtn');const lastResetDate=document.getElementById('lastResetDate');const redeemAllBtn=document.getElementById('redeemAllBtn');const redeemSelectedBtn=document.getElementById('redeemSelectedBtn');const redeemConfirmModal=document.getElementById('redeemConfirmModal');const closeRedeemConfirmModal=document.getElementById('closeRedeemConfirmModal');const confirmRedeemBtn=document.getElementById('confirmRedeemBtn');const cancelRedeemBtn=document.getElementById('cancelRedeemBtn');const redeemConfirmDetails=document.getElementById('redeemConfirmDetails');const warehouseItemsList=document.getElementById('warehouseItemsList');const warehouseTotalValue=document.getElementById('warehouseTotalValue');const warehouseTotalGold=document.getElementById('warehouseTotalGold');const warehouseCount=document.getElementById('warehouseCount');const refreshGlobalHistoryBtn=document.getElementById('refreshGlobalHistoryBtn');const clearGlobalHistoryBtn=document.getElementById('clearGlobalHistoryBtn');const globalHistoryTableBody=document.getElementById('globalHistoryTableBody');const globalHistoryCount=document.getElementById('globalHistoryCount');const userWarehouseSelect=document.getElementById('userWarehouseSelect');const selectedUserWarehouse=document.getElementById('selectedUserWarehouse');const selectedUserName=document.getElementById('selectedUserName');const selectedUserItemCount=document.getElementById('selectedUserItemCount');const selectedUserWarehouseItems=document.getElementById('selectedUserWarehouseItems');const adminHomeStats=document.getElementById('adminHomeStats');const adminBoxesPreview=document.getElementById('adminBoxesPreview');const subadminBoxesPreview=document.getElementById('subadminBoxesPreview');const adminTotalUsersHome=document.getElementById('adminTotalUsersHome');const adminOpenedBoxesHome=document.getElementById('adminOpenedBoxesHome');const adminRemainingBoxesHome=document.getElementById('adminRemainingBoxesHome');const adminRoundProgressHome=document.getElementById('adminRoundProgressHome');const adminTotalValueHome=document.getElementById('adminTotalValueHome');const adminRemainingValueHome=document.getElementById('adminRemainingValueHome');const adminTotalSpentGold=document.getElementById('adminTotalSpentGold');const adminTotalObtainedValue=document.getElementById('adminTotalObtainedValue');const adminValueDifference=document.getElementById('adminValueDifference');const adminPanelDrawer=document.getElementById('adminPanelDrawer');const adminPanelToggle=document.getElementById('adminPanelToggle');const adminPanelContent=document.getElementById('adminPanelContent');const adminPanelIcon=document.getElementById('adminPanelIcon');const panelModifyCoinsBtn=document.getElementById('panelModifyCoinsBtn');const panelApproveUsersBtn=document.getElementById('panelApproveUsersBtn');const panelAddItemBtn=document.getElementById('panelAddItemBtn');const panelResetItemsBtn=document.getElementById('panelResetItemsBtn');const panelResetDefaultBtn=document.getElementById('panelResetDefaultBtn');const panelRefreshHistoryBtn=document.getElementById('panelRefreshHistoryBtn');const panelClearHistoryBtn=document.getElementById('panelClearHistoryBtn');const panelViewWarehouseBtn=document.getElementById('panelViewWarehouseBtn');const panelResetUnopenedBtn=document.getElementById('panelResetUnopenedBtn');const adminPanelItemsSection=document.getElementById('adminPanelItemsSection');const adminPanelBoxesSection=document.getElementById('adminPanelBoxesSection');const adminPanelHistorySection=document.getElementById('adminPanelHistorySection');const targetValueInput=document.getElementById('targetValueInput');const panelResetByValueBtn=document.getElementById('panelResetByValueBtn');const adminTargetValueInput=document.getElementById('adminTargetValueInput');const adminResetByValueBtn=document.getElementById('adminResetByValueBtn');const resetUnopenedBoxesBtn=document.getElementById('resetUnopenedBoxesBtn');const editBoxItemModal=document.getElementById('editBoxItemModal');const closeEditBoxItemModal=document.getElementById('closeEditBoxItemModal');const editBoxNumber=document.getElementById('editBoxNumber');const currentItemInfo=document.getElementById('currentItemInfo');const boxItemSelect=document.getElementById('boxItemSelect');const newItemPreview=document.getElementById('newItemPreview');const saveBoxItemBtn=document.getElementById('saveBoxItemBtn');const registerModal=document.getElementById('registerModal');const registerModalBtn=document.getElementById('registerModalBtn');const closeRegisterModal=document.getElementById('closeRegisterModal');const registerBtn=document.getElementById('registerBtn');const goToRegisterFromLogin=document.getElementById('goToRegisterFromLogin');const goToLoginFromRegister=document.getElementById('goToLoginFromRegister');const registerFromHome=document.getElementById('registerFromHome');const registerFromWarehouse=document.getElementById('registerFromWarehouse');const registerFromHistory=document.getElementById('registerFromHistory');const registerFromProfile=document.getElementById('registerFromProfile');const adminItemsSection=document.getElementById('adminItemsSection');const adminBoxesSection=document.getElementById('adminBoxesSection');const adminHistorySection=document.getElementById('adminHistorySection');const adminSubtitle=document.getElementById('adminSubtitle');const coinOperationsTableBody=document.getElementById('coinOperationsTableBody');const coinOperationsCount=document.getElementById('coinOperationsCount');const refreshCoinOperationsBtn=document.getElementById('refreshCoinOperationsBtn');const clearCoinOperationsBtn=document.getElementById('clearCoinOperationsBtn');const coinOperationsFilterUser=document.getElementById('coinOperationsFilterUser');const coinOperationsFilterType=document.getElementById('coinOperationsFilterType');async function resetSystemData(type='all'){if(window._isResettingSystem){showMessage('系统正在重置中，请稍后再试','warning');return}
window._isResettingSystem=!0;try{showMessage('正在清空系统数据...','info');if(!gameData.currentUser||gameData.currentUser.role!=='admin'){showMessage('只有GM可以执行此操作','error');return}
const{data,error}=await supabase.rpc('reset_system_data',{p_admin_id:gameData.currentUser.id,p_reset_type:type});if(error){console.error('RPC调用失败:',error);showMessage('调用清空函数失败: '+error.message,'error');return}
if(!data.success){showMessage(data.message,'error');return}
await loadGameData();if(gameData.currentUser){if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin();updateAdminData()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin();updateAdminData()}else{renderTreasureBoxes()}
updateAdminHomeStats();updateGlobalHistoryDisplay();updateHistoryDisplay();updateWarehouseDisplay();updateCoinOperationsDisplay()}
showMessage(data.message,'success')}catch(error){console.error('清空系统数据异常:',error);showMessage('清空失败: '+error.message,'error')}finally{window._isResettingSystem=!1}}
let resultModalAutoCloseTimer=null;let redeemType='';let selectedItemsForRedeem=[];let adminPanelExpanded=!1;let currentEditingBoxId=null;let dataSubscription=null;async function saveRoundToSupabase(roundData){try{if(!roundData.id){console.error('无法保存轮次数据：缺少ID');return{success:!1,error:'缺少轮次ID'}}
const updatedBoxes=roundData.boxes.map(box=>({id:box.id,isOpened:box.isOpened,openedBy:box.openedBy,itemId:box.itemId,presetItemId:box.presetItemId,openedAt:box.openedAt}));const updateData={boxes:updatedBoxes,updated_at:new Date().toISOString()};const{error}=await supabase.from('global_rounds').update(updateData).eq('id',roundData.id);if(error){console.error('Supabase更新错误:',error);throw error}
return{success:!0}}catch(error){console.error('保存轮次数据失败:',error);return{success:!1,error:error.message}}}
async function loadGameData(){try{const{data:chatData,error:chatError}=await supabase.from('chat_messages').select('*').order('created_at',{ascending:!1}).limit(50);if(!chatError&&chatData){gameData.chatMessages=chatData.reverse()}else{gameData.chatMessages=[]}}catch(e){console.warn('聊天表不存在或加载失败，请确保已创建:',e);gameData.chatMessages=[]}
subscribeToChatMessages();if(gameData.currentUser){startHeartbeat();updateOnlineUsersList()}
try{console.log('开始加载游戏数据...');setTimeout(()=>{setupRealtimeSubscriptions()},2000);setTimeout(()=>{if(typeof checkItemsAndBoxesSync==='undefined'){window.checkItemsAndBoxesSync=async function(){if(!gameData.globalRound||!gameData.globalRound.boxes)return;const itemUsageCount={};gameData.globalRound.boxes.forEach(box=>{if(!box.isOpened&&box.presetItemId&&box.presetItemId!==0){itemUsageCount[box.presetItemId]=(itemUsageCount[box.presetItemId]||0)+1}})}}
setTimeout(()=>{if(typeof checkItemsAndBoxesSync==='function'){checkItemsAndBoxesSync()}},1000)},1000);const[usersResponse,itemsResponse,historyResponse,settingsResponse,roundResponse,coinOperationsResponse]=await Promise.all([supabase.from('users').select('*'),supabase.from('items').select('*'),supabase.from('user_history').select('*').order('obtained_at',{ascending:!1}).limit(100),supabase.from('system_settings').select('*').eq('id',1).single(),supabase.from('global_rounds').select('*').order('round_id',{ascending:!1}).limit(1).single(),supabase.from('coin_operations').select('*').order('created_at',{ascending:!1}).limit(100)]);if(usersResponse.error)throw usersResponse.error;gameData.users=usersResponse.data||[];if(itemsResponse.error)throw itemsResponse.error;gameData.items=itemsResponse.data||[];if(historyResponse.error)throw historyResponse.error;gameData.userHistory=historyResponse.data||[];if(settingsResponse.error&&settingsResponse.error.code!=='PGRST116'){throw settingsResponse.error}
if(roundResponse.error&&roundResponse.error.code!=='PGRST116'){throw roundResponse.error}
if(roundResponse.data){const roundData=roundResponse.data;gameData.globalRound={id:roundData.id,round_id:roundData.round_id,boxes:roundData.boxes||[],started_at:roundData.started_at,completed_at:roundData.completed_at,preset_generated:roundData.preset_generated||!1};if(!gameData.globalRound.boxes||!Array.isArray(gameData.globalRound.boxes)||gameData.globalRound.boxes.length!==50){console.log('初始化宝盒数据...');gameData.globalRound.boxes=Array(50).fill().map((_,index)=>({id:index+1,isOpened:!1,openedBy:null,itemId:null,presetItemId:null,openedAt:null}));gameData.globalRound.preset_generated=!1;await saveRoundToSupabase(gameData.globalRound)}
async function checkItemsAndBoxesSync(){if(!gameData.globalRound||!gameData.globalRound.boxes)return;const itemUsageCount={};gameData.globalRound.boxes.forEach(box=>{if(!box.isOpened&&box.presetItemId&&box.presetItemId!==0){itemUsageCount[box.presetItemId]=(itemUsageCount[box.presetItemId]||0)+1}});let hasInconsistencies=!1;const inconsistencies=[];for(const itemId in itemUsageCount){const item=gameData.items.find(i=>i.id===parseInt(itemId));if(item){const allocatedCount=itemUsageCount[itemId];const availableCount=item.remaining||0;if(allocatedCount>availableCount){hasInconsistencies=!0;inconsistencies.push({itemId:item.id,itemName:item.name,allocatedCount,availableCount,excessCount:allocatedCount-availableCount})}}}
if(hasInconsistencies&&gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){console.warn('检测到物品数量不一致:',inconsistencies);const message=`检测到 ${inconsistencies.length} 个物品数量不一致。正在自动修复...`;showMessage(message,'warning');await fixOverallocatedItems(inconsistencies)}else if(hasInconsistencies){}}
async function fixOverallocatedItems(itemId,allocatedCount,availableCount){const itemIdNum=parseInt(itemId);const boxesWithItem=gameData.globalRound.boxes.filter(box=>!box.isOpened&&box.presetItemId===itemIdNum);const boxesToClear=boxesWithItem.slice(availableCount);for(const box of boxesToClear){box.presetItemId=0}
await saveRoundToSupabase(gameData.globalRound);if(gameData.currentUser&&gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}
showMessage(`已修复 ${boxesToClear.length} 个过度分配的宝盒`,'success')}
if(!gameData.globalRound.preset_generated){try{const{data:generateResult,error:generateError}=await supabase.rpc('generate_preset_items_for_boxes',{round_id:gameData.globalRound.id});if(generateError){console.error('生成奖品失败:',generateError);gameData.globalRound.boxes.forEach(box=>{if(!box.isOpened&&(box.presetItemId===null||box.presetItemId===undefined)){box.presetItemId=0}});gameData.globalRound.preset_generated=!0;await saveRoundToSupabase(gameData.globalRound)}else{const{data:updatedRound,error:updateError}=await supabase.from('global_rounds').select('*').eq('id',gameData.globalRound.id).single();if(!updateError&&updatedRound){gameData.globalRound={...gameData.globalRound,boxes:updatedRound.boxes,preset_generated:updatedRound.preset_generated}}}}catch(error){console.error('调用奖品函数失败:',error);gameData.globalRound.boxes.forEach(box=>{if(!box.isOpened&&(box.presetItemId===null||box.presetItemId===undefined)){box.presetItemId=0}});gameData.globalRound.preset_generated=!0;await saveRoundToSupabase(gameData.globalRound)}}}else{const newRound={round_id:1,boxes:Array(50).fill().map((_,index)=>({id:index+1,isOpened:!1,openedBy:null,itemId:null,presetItemId:null,openedAt:null})),started_at:new Date().toISOString(),completed_at:null,preset_generated:!1};const{data:createdRound,error}=await supabase.from('global_rounds').insert([newRound]).select().single();if(error)throw error;gameData.globalRound={id:createdRound.id,round_id:createdRound.round_id,boxes:createdRound.boxes||newRound.boxes,started_at:createdRound.started_at,completed_at:createdRound.completed_at,preset_generated:createdRound.preset_generated||!1}}
if(coinOperationsResponse.error){console.warn('加载金币操作记录时出错（表可能不存在）:',coinOperationsResponse.error);gameData.coinOperations=[]}else{gameData.coinOperations=coinOperationsResponse.data||[]}
const currentUserId=localStorage.getItem('currentUserId');const currentUserToken=localStorage.getItem('currentUserToken');if(currentUserId&&currentUserToken){const user=gameData.users.find(u=>u.id==currentUserId);if(user){if(user.current_login_token===currentUserToken)startRealTimeTokenChecker(user);gameData.currentUser={...user,warehouse:user.warehouse||{},boxesOpened:user.boxes_opened||0}}}
if(coinOperationsResponse.error){console.error('加载金币操作记录出错:',coinOperationsResponse.error)}else{gameData.coinOperations=coinOperationsResponse.data||[]}
console.log('游戏数据加载完成');setupRealtimeSubscriptions()}catch(error){console.error('加载游戏数据时出错:',error);showMessage('加载数据失败，请刷新页面重试','error')}}
function subscribeToChatMessages(){if(chatSubscription)supabase.removeChannel(chatSubscription);chatSubscription=supabase.channel('chat-messages-realtime').on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},(payload)=>{const newMsg=payload.new;if(!gameData.chatMessages.some(m=>m.id===newMsg.id)){gameData.chatMessages.push(newMsg);if(gameData.chatMessages.length>100)gameData.chatMessages.shift();if(gameData.currentUser&&newMsg.user_id!==gameData.currentUser.id){const activeSection=document.querySelector('.content-section.active');const isChatActive=activeSection&&activeSection.id==='chat-section';if(!isChatActive){unreadChatCount++;updateChatUnreadBadge()}}
if(document.getElementById('chat-section')?.classList.contains('active')){renderChatMessages()}}}).subscribe()}
function setupRealtimeSubscriptions(){console.log('设置实时订阅...');if(dataSubscription){try{const subscriptions=Object.values(dataSubscription);for(const sub of subscriptions){if(sub&&typeof sub.unsubscribe==='function'){sub.unsubscribe()}}
dataSubscription=null;console.log('旧订阅已清理')}catch(error){console.error('移除旧订阅时出错:',error)}}
try{const roundsSubscription=supabase.channel('rounds-changes').on('postgres_changes',{event:'*',schema:'public',table:'global_rounds'},(payload)=>{handleRealtimeUpdate(payload)}).subscribe((status)=>{if(status==='SUBSCRIBED'){}else if(status==='CHANNEL_ERROR'){console.error('轮次订阅通道错误，将在5秒后重试');setTimeout(()=>{if(dataSubscription&&dataSubscription.rounds){dataSubscription.rounds.unsubscribe();setupRealtimeSubscriptions()}},5000)}});const coinOperationsSubscription=supabase.channel('coin-operations-changes').on('postgres_changes',{event:'*',schema:'public',table:'coin_operations'},(payload)=>{handleRealtimeUpdate(payload)}).subscribe((status)=>{if(status==='SUBSCRIBED'){}});const usersSubscription=supabase.channel('users-changes').on('postgres_changes',{event:'*',schema:'public',table:'users'},(payload)=>{handleRealtimeUpdate(payload)}).subscribe();const itemsSubscription=supabase.channel('items-changes').on('postgres_changes',{event:'*',schema:'public',table:'items'},(payload)=>{handleRealtimeUpdate(payload)}).subscribe();const historySubscription=supabase.channel('history-changes').on('postgres_changes',{event:'*',schema:'public',table:'user_history'},(payload)=>{handleRealtimeUpdate(payload)}).subscribe();dataSubscription={users:usersSubscription,items:itemsSubscription,history:historySubscription,rounds:roundsSubscription,coinOperations:coinOperationsSubscription};console.log('实时订阅设置完成');setInterval(()=>{if(dataSubscription&&dataSubscription.rounds){console.log('实时订阅心跳检测: 正常')}},60000)}catch(error){console.error('设置实时订阅时出错:',error);setTimeout(setupRealtimeSubscriptions,10000)}}
let tokenRealtimeSubscription=null;function startRealTimeTokenChecker(user){if(tokenRealtimeSubscription){supabase.removeChannel(tokenRealtimeSubscription);tokenRealtimeSubscription=null}
tokenRealtimeSubscription=supabase.channel(`user-token-${user.id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'users',filter:`id=eq.${user.id}`},(payload)=>{handleUserTokenUpdate(payload)}).subscribe((status)=>{})}
function handleUserTokenUpdate(payload){const{new:newData,old:oldData}=payload;if(!gameData.currentUser||newData.id!==gameData.currentUser.id){return}
const localToken=localStorage.getItem('currentUserToken');const serverToken=newData.current_login_token;if(serverToken!==localToken){forceLogoutWithMessage('您的账户已在其他设备登录，当前设备已强制退出')}
if(newData.is_active===!1){forceLogoutWithMessage('您的账户已被管理员禁用')}}
function handleRealtimeUpdate(payload){const{eventType,table,new:newData,old:oldData}=payload;if(table==='global_rounds'&&eventType==='UPDATE'&&newData.boxes){const updatedBoxes=newData.boxes;if(currentEditingBoxId){const editedBox=updatedBoxes.find(b=>b.id===currentEditingBoxId);if(editedBox&&editedBox.isOpened){editBoxItemModal.classList.remove('active');currentEditingBoxId=null;showMessage(`您正在编辑的宝盒 #${currentEditingBoxId} 已被开启，编辑已取消`,'warning')}}}
switch(table){case 'users':handleUsersUpdate(eventType,newData,oldData);break;case 'items':handleItemsUpdate(eventType,newData,oldData);break;case 'user_history':handleHistoryUpdate(eventType,newData,oldData);break;case 'global_rounds':handleRoundsUpdate(eventType,newData,oldData);break;case 'coin_operations':handleCoinOperationsUpdate(eventType,newData,oldData);break}}
function handleCoinOperationsUpdate(eventType,newData,oldData){try{if(eventType==='INSERT'){gameData.coinOperations=gameData.coinOperations||[];gameData.coinOperations.unshift(newData)}else if(eventType==='DELETE'){gameData.coinOperations=gameData.coinOperations||[];gameData.coinOperations=gameData.coinOperations.filter(record=>record.id!==oldData.id)}
if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){updateCoinOperationsDisplay()}
if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){updateAdminData()}}catch(error){console.error('处理金币操作记录更新时出错:',error)}}
function handleUsersUpdate(eventType,newData,oldData){try{if(eventType==='INSERT'){gameData.users.push(newData)}else if(eventType==='UPDATE'){const index=gameData.users.findIndex(user=>user.id===newData.id);if(index!==-1){gameData.users[index]=newData;if(gameData.currentUser&&gameData.currentUser.id===newData.id){if(newData.is_active===!1){showMessage('您的账户已被管理员禁用','error');setTimeout(()=>handleLogout(),1000);return}
const localToken=localStorage.getItem('currentUserToken');const serverToken=newData.current_login_token;if(serverToken!==localToken){showMessage('您的账户已在其他设备登录，当前设备已强制退出','warning');setTimeout(()=>handleLogout(),1500);return}
gameData.currentUser={...gameData.currentUser,...newData,warehouse:newData.warehouse||{},boxesOpened:newData.boxes_opened||0,redeemHistory:newData.redeem_history||[]};updateUserUI();if(warehouseContainer&&warehouseContainer.style.display!=='none'){updateWarehouseDisplay()}
if(document.getElementById('profile-section').classList.contains('active')){populateProfileForm()}}}}else if(eventType==='DELETE'){gameData.users=gameData.users.filter(user=>user.id!==oldData.id);if(gameData.currentUser&&gameData.currentUser.id===oldData.id){handleLogout()}}
if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){updateAdminData();populateUserWarehouseSelect();updateAdminHomeStats()}}catch(error){console.error('处理用户更新时出错:',error)}}
document.getElementById('debugRefreshBtn')?.addEventListener('click',async()=>{try{const roundResponse=await supabase.from('global_rounds').select('*').order('round_id',{ascending:!1}).limit(1).single();if(!roundResponse.error&&roundResponse.data){gameData.globalRound={...gameData.globalRound,...roundResponse.data};if(gameData.currentUser){await checkLoginToken();if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin()}else{renderTreasureBoxes()}
updateRoundStats();updateAdminHomeStats();showMessage('宝盒状态已强制刷新','success')}}}catch(error){console.error('强制刷新出错:',error);showMessage('刷新失败','error')}});function handleItemsUpdate(eventType,newData,oldData){try{if(eventType==='INSERT'){gameData.items.push(newData)}else if(eventType==='UPDATE'){const index=gameData.items.findIndex(item=>item.id===newData.id);if(index!==-1){gameData.items[index]=newData}}else if(eventType==='DELETE'){gameData.items=gameData.items.filter(item=>item.id!==oldData.id)}
if(gameData.currentUser){if(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'){updateAdminData();updateAdminHomeStats()}else{updateWarehouseDisplay()}}}catch(error){console.error('处理物品更新时出错:',error)}}
function handleHistoryUpdate(eventType,newData,oldData){try{if(eventType==='INSERT'){if(newData.obtained_at&&!newData.obtained_at.includes('Z')){newData.obtained_at=newData.obtained_at+'Z'}
gameData.userHistory.unshift(newData)}else if(eventType==='DELETE'){gameData.userHistory=gameData.userHistory.filter(record=>record.id!==oldData.id)}
const historySection=document.getElementById('history-section');const adminSection=document.getElementById('admin-section');if(historySection&&historySection.classList.contains('active')){updateHistoryDisplay()}
if(adminSection&&adminSection.classList.contains('active')){const adminContent=document.getElementById('adminContent');if(adminContent&&adminContent.style.display!=='none'){updateGlobalHistoryDisplay()}}
const homeSection=document.getElementById('home-section');if(homeSection&&homeSection.classList.contains('active')&&gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){updateAdminHomeStats()}
if(adminSection&&adminSection.classList.contains('active')&&gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){const consumptionData=calculateUserConsumptionAndProfit()}
updateAdminData()}catch(error){console.error('处理历史记录更新时出错:',error)}}
function handleRoundsUpdate(eventType,newData,oldData){try{if(eventType==='UPDATE'){const oldBoxes=gameData.globalRound.boxes||[];gameData.globalRound={...gameData.globalRound,...newData};if(oldBoxes&&newData.boxes){const changedBoxes=[];for(let i=0;i<newData.boxes.length;i++){const newBox=newData.boxes[i];const oldBox=oldBoxes[i]||{isOpened:!1};if(newBox.isOpened!==oldBox.isOpened||newBox.openedBy!==oldBox.openedBy||newBox.presetItemId!==oldBox.presetItemId){changedBoxes.push({id:newBox.id,oldState:oldBox,newState:newBox})}}
if(changedBoxes.length>0&&gameData.currentUser){const isHomePage=document.getElementById('home-section').classList.contains('active');if(isHomePage){if(gameData.currentUser.role==='admin'){updateChangedBoxesForAdmin(changedBoxes)}else if(gameData.currentUser.role==='subadmin'){updateChangedBoxesForSubadmin(changedBoxes)}else{updateChangedBoxes(changedBoxes)}}}}
updateRoundStats();updateAdminHomeStats();if(!isBoxOpening){enableAllBoxes()}}else if(eventType==='INSERT'){if(window._lastProcessedRoundId&&newData.round_id<=window._lastProcessedRoundId){return}
if(window._isLoadingNewRound)return;window._isLoadingNewRound=!0;window._lastProcessedRoundId=newData.round_id;setTimeout(async()=>{try{const{data:latestRound,error}=await supabase.from('global_rounds').select('*').eq('id',newData.id).single();if(error)throw error;gameData.globalRound={id:latestRound.id,round_id:latestRound.round_id,boxes:latestRound.boxes||[],started_at:latestRound.started_at,completed_at:latestRound.completed_at,preset_generated:latestRound.preset_generated||!1};const homeSection=document.getElementById('home-section');if(homeSection&&homeSection.classList.contains('active')){if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin()}else{renderTreasureBoxes()}
updateRoundStats()}
if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){updateAdminHomeStats()}
showMessage('🎉 所有盲盒已开启，新的一轮开始啦！','success')}catch(error){console.error('实时订阅加载新轮次失败:',error);showMessage('新轮次加载失败，请刷新页面','warning')}finally{window._isLoadingNewRound=!1}},500)}}catch(error){console.error('处理轮次更新时出错:',error)}}
function refreshCurrentPageBoxes(){if(!gameData.currentUser)return;const currentPage=document.querySelector('.content-section.active').id.replace('-section','');if(currentPage==='home'){if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin()}else{renderTreasureBoxes()}
updateRoundStats();if(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'){updateAdminHomeStats()}}}
function updateChangedBoxes(changedBoxes){if(!blindBoxesGrid)return;changedBoxes.forEach(boxData=>{const boxElement=document.querySelector(`.treasure-box[data-box-id="${boxData.id}"]`);if(!boxElement)return;const box=boxData.newState;const isOpenedByCurrentUser=box.isOpened&&box.openedBy===gameData.currentUser.id;const isOpenedByOthers=box.isOpened&&box.openedBy!==gameData.currentUser.id;if(isOpenedByCurrentUser){boxElement.className='treasure-box opened';boxElement.style.opacity='1'}else if(isOpenedByOthers){boxElement.className='treasure-box opened';boxElement.style.opacity='0.6'}else{boxElement.className='treasure-box';boxElement.style.opacity='1'}
const boxLabel=boxElement.querySelector('.box-label');const boxSubtitle=boxElement.querySelector('.box-subtitle');if(boxLabel&&boxSubtitle){if(isOpenedByCurrentUser){boxLabel.textContent='✓';boxSubtitle.textContent=''}else if(isOpenedByOthers){boxLabel.textContent='🔒';boxSubtitle.textContent=''}else{boxLabel.textContent='';boxSubtitle.textContent='点击开启'}}
let openerInfo=boxElement.querySelector('.box-opener-info');if(box.isOpened){const openerName=getUsernameById(box.openedBy);if(openerInfo){openerInfo.textContent=`开启者: ${openerName}`}else{openerInfo=document.createElement('div');openerInfo.className='box-opener-info';openerInfo.textContent=`开启者: ${openerName}`;boxElement.appendChild(openerInfo)}}else{if(openerInfo)openerInfo.remove();}
if(box.isOpened){boxElement.style.cursor='default';boxElement.onclick=null}else if(gameData.currentUser.role==='user'&&gameData.currentUser.approved){boxElement.style.cursor='pointer';boxElement.onclick=()=>{if(isBoxOpening){showMessage('请等待当前开盒结果确认后再开启其他宝盒','warning');return}
openBox(box.id)}}else{boxElement.style.cursor='default';boxElement.onclick=null}})}
function updateChangedBoxesForAdmin(changedBoxes){if(!blindBoxesGrid)return;changedBoxes.forEach(boxData=>{const boxElement=document.querySelector(`.treasure-box[data-box-id="${boxData.id}"]`);if(!boxElement)return;const box=boxData.newState;if(box.isOpened){boxElement.className='treasure-box admin-opened'}else{boxElement.className='treasure-box'}
const boxLabel=boxElement.querySelector('.box-label');const boxSubtitle=boxElement.querySelector('.box-subtitle');const presetItemElement=boxElement.querySelector('.box-preset-item');if(boxLabel&&boxSubtitle){boxLabel.textContent=box.isOpened?'✓':'';boxSubtitle.textContent=box.isOpened?'已开启':'未开启'}
if(presetItemElement){let displayContent='📦';let presetItemName='空盒';let presetItemValue=0;let presetItemRarity='common';if(box.presetItemId!==null&&box.presetItemId!==0){const presetItem=gameData.items.find(item=>item.id===box.presetItemId);if(presetItem){presetItemName=presetItem.name;presetItemValue=presetItem.value;presetItemRarity=presetItem.rarity;const displayUrl=presetItem.cover_url||(presetItem.media_url&&presetItem.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)?presetItem.media_url:null);if(displayUrl){displayContent=`<img src="${displayUrl}" alt="${presetItemName}" 
                            style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; border: 2px solid ${getRarityColor(presetItemRarity)};">`}else{displayContent=presetItem.icon||'🎁'}}}
presetItemElement.innerHTML=displayContent;const tooltip=boxElement.querySelector('.preset-item-tooltip');if(tooltip){tooltip.innerHTML=`
                    <strong>${presetItemName}</strong><br>
                    价值: ${presetItemValue} 金币<br>
                    稀有度: ${getRarityText(presetItemRarity)}
                `}}
if(!box.isOpened){boxElement.style.cursor='pointer';boxElement.onclick=()=>showBoxItemEditModal(box.id)}else{boxElement.style.cursor='default';boxElement.onclick=null}})}
function updateChangedBoxesForSubadmin(changedBoxes){if(!blindBoxesGrid)return;changedBoxes.forEach(boxData=>{const boxElement=document.querySelector(`.treasure-box[data-box-id="${boxData.id}"]`);if(!boxElement)return;const box=boxData.newState;if(box.isOpened){boxElement.className='treasure-box admin-opened'}else{boxElement.className='treasure-box'}
const boxLabel=boxElement.querySelector('.box-label');const boxSubtitle=boxElement.querySelector('.box-subtitle');if(boxLabel&&boxSubtitle){boxLabel.textContent=box.isOpened?'✓':'';boxSubtitle.textContent=box.isOpened?'已开启':'未开启'}
if(box.isOpened&&box.openedBy){let openerInfo=boxElement.querySelector('.box-opener-info');if(!openerInfo){openerInfo=document.createElement('div');openerInfo.className='box-opener-info';boxElement.appendChild(openerInfo)}
const openerName=getUsernameById(box.openedBy);openerInfo.textContent=`开启者: ${openerName}`}else{const openerInfo=boxElement.querySelector('.box-opener-info');if(openerInfo){openerInfo.remove()}}
boxElement.style.cursor='default';boxElement.onclick=null})}
function cleanupRealtimeSubscriptions(){try{if(dataSubscription){if(dataSubscription.users){supabase.removeChannel(dataSubscription.users)}
if(dataSubscription.items){supabase.removeChannel(dataSubscription.items)}
if(dataSubscription.history){supabase.removeChannel(dataSubscription.history)}
if(dataSubscription.rounds){supabase.removeChannel(dataSubscription.rounds)}
if(dataSubscription.coinOperations)supabase.removeChannel(dataSubscription.coinOperations);dataSubscription=null;console.log('实时订阅已清理')}}catch(error){console.error('清理实时订阅时出错:',error)}}
function calculateBoxValues(){let totalValue=0;let remainingValue=0;gameData.globalRound.boxes.forEach(box=>{if(box.presetItemId!==null&&box.presetItemId!==0){const item=gameData.items.find(item=>item.id===box.presetItemId);if(item){totalValue+=item.value;if(!box.isOpened){remainingValue+=item.value}}}});return{totalValue,remainingValue}}
function calculateUserConsumptionAndProfit(){let totalSpentGold=0;let totalObtainedValue=0;const boxCost=Number(gameData.systemSettings.box_cost)||20000;gameData.users.forEach(user=>{if(user.role==='user'&&user.approved){const boxesOpened=Number(user.boxes_opened)||0;totalSpentGold+=boxesOpened*boxCost}});gameData.userHistory.forEach(record=>{const recordValue=Number(record.value)||0;totalObtainedValue+=recordValue});const valueDifference=totalSpentGold-totalObtainedValue;return{totalSpentGold,totalObtainedValue,valueDifference}}
async function init(){updateChatUnreadBadge();localStorage.removeItem('currentUserId');localStorage.removeItem('currentUserToken');gameData.currentUser=null;updateUserUI();addShakeAnimationStyle();if(window.navigator&&typeof window.navigator.vibrate==='function'){}else{console.warn('❌ 设备不支持物理震动（仅CSS动画生效）')}
console.log('初始化游戏...');showMessage('正在加载游戏数据...','info');await loadGameData();function bindModeButtons(){const modeBtns=document.querySelectorAll('.mode-btn');const modeSelect=document.getElementById('modeSelect');function updateModeUI(mode){modeBtns.forEach(btn=>{const btnMode=parseInt(btn.dataset.mode);if(btnMode===mode){btn.classList.add('active')}else{btn.classList.remove('active')}});if(modeSelect){modeSelect.value=mode}}
modeBtns.forEach(btn=>{btn.addEventListener('click',()=>{const mode=parseInt(btn.dataset.mode);if(isNaN(mode))return;currentBoxMode=mode;updateModeUI(mode);showMessage(`已切换到${mode === 1 ? '普通' : mode === 2 ? '高级' : '豪华'}模式`,'info')});btn.addEventListener('touchstart',(e)=>{e.preventDefault();btn.click()})});if(modeSelect){modeSelect.addEventListener('change',(e)=>{const mode=parseInt(e.target.value);currentBoxMode=mode;updateModeUI(mode);showMessage(`已切换到${mode === 1 ? '普通' : mode === 2 ? '高级' : '豪华'}模式`,'info')})}
updateModeUI(1)}
if(!gameData.currentUser){userLoggedOut.style.display='block';userLoggedIn.style.display='none';document.getElementById('sidebar').style.display='none';showPage('home')}
bindEvents();updateWarehouseDisplay();updateHistoryDisplay();updateAdminData();createCoinRain();updateLastResetDate();updateGlobalHistoryDisplay();populateUserWarehouseSelect();updateCoinOperationsDisplay();populateCoinOperationsFilterUser();setTimeout(()=>{const message=document.querySelector('.message');if(message)message.remove();},1000);bindModeSelector();currentPage='home';console.log('游戏初始化完成')}
let tokenCheckInterval=null;function startTokenChecker(){if(tokenCheckInterval){clearInterval(tokenCheckInterval)}
tokenCheckInterval=setInterval(async()=>{await checkLoginToken()},10000)}
let currentBoxMode=1;function bindModeSelector(){const modeSelect=document.getElementById('modeSelect');if(!modeSelect)return;modeSelect.addEventListener('change',(e)=>{const mode=parseInt(e.target.value);if(isNaN(mode))return;currentBoxMode=mode;const modeName=mode===1?'普通':mode===2?'高级':'豪华';showMessage(`已切换到 ${modeName} 模式`,'info')});modeSelect.value="1";currentBoxMode=1}
async function rollbackBoxOperation(boxId,userId,boxCost){try{const boxIndex=gameData.globalRound.boxes.findIndex(box=>box.id===boxId);if(boxIndex!==-1){gameData.globalRound.boxes[boxIndex]={...gameData.globalRound.boxes[boxIndex],isOpened:!1,openedBy:null,itemId:null,openedAt:null}}
if(gameData.currentUser){gameData.currentUser.balance+=boxCost}
await saveRoundToSupabase(gameData.globalRound);await supabase.from('users').update({balance:gameData.currentUser.balance}).eq('id',userId)}catch(error){console.error('回滚失败:',error)}}
async function checkLoginToken(){if(!gameData.currentUser)return;try{const currentUserId=localStorage.getItem('currentUserId');const localToken=localStorage.getItem('currentUserToken');if(!currentUserId||!localToken){forceLogoutWithMessage('登录信息不完整');return}
const userId=parseInt(currentUserId,10);if(isNaN(userId)){console.error('用户ID不是有效整数:',currentUserId);forceLogoutWithMessage('用户ID格式错误');return}
const{data,error}=await supabase.rpc('verify_login_token',{p_user_id:userId,p_token:localToken});if(error){console.error('令牌验证失败:',error);forceLogoutWithMessage('登录验证失败');return}
let result;try{result=typeof data==='string'?JSON.parse(data):data}catch(e){console.error('解析返回数据失败:',e,data);forceLogoutWithMessage('登录信息验证失败');return}
if(!result.success){forceLogoutWithMessage(result.message);return}
gameData.currentUser={...gameData.currentUser,...result.user,warehouse:result.user.warehouse||{},boxesOpened:result.user.boxes_opened||0};updateUserUI()}catch(error){console.error('令牌检查异常:',error);forceLogoutWithMessage('登录状态检查失败')}}
function forceLogoutWithMessage(message='您的账户已在其他设备登录'){showMessage(message,'warning');setTimeout(()=>{handleLogout();setTimeout(()=>{loginModal.classList.add('active')},1000)},1000)}
function forceLogout(){handleLogout()}
const uploadArea=document.getElementById('uploadArea');const uploadBtn=document.getElementById('uploadBtn');const removeMediaBtn=document.getElementById('removeMediaBtn');const previewContainer=document.getElementById('previewContainer');const previewContent=document.getElementById('previewContent');const itemMediaInput=document.getElementById('itemMedia');let currentMediaFile=null;let currentMediaUrl='';if(uploadBtn){uploadBtn.addEventListener('click',()=>itemMediaInput.click())}
if(uploadArea){uploadArea.addEventListener('click',()=>itemMediaInput.click());['dragenter','dragover','dragleave','drop'].forEach(eventName=>{uploadArea.addEventListener(eventName,preventDefaults,!1)});function preventDefaults(e){e.preventDefault();e.stopPropagation()}['dragenter','dragover'].forEach(eventName=>{uploadArea.addEventListener(eventName,highlight,!1)});['dragleave','drop'].forEach(eventName=>{uploadArea.addEventListener(eventName,unhighlight,!1)});function highlight(){uploadArea.parentElement.classList.add('drag-over')}
function unhighlight(){uploadArea.parentElement.classList.remove('drag-over')}
uploadArea.addEventListener('drop',handleDrop,!1);function handleDrop(e){const dt=e.dataTransfer;const files=dt.files;if(files.length>0){handleFileSelect(files[0])}}}
if(itemMediaInput){itemMediaInput.addEventListener('change',(e)=>{if(e.target.files.length>0){handleFileSelect(e.target.files[0])}})}
if(removeMediaBtn){removeMediaBtn.addEventListener('click',removeMedia)}
function handleFileSelect(file){const validTypes=['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm','video/ogg','video/quicktime','video/x-matroska','video/avi','video/x-msvideo','video/x-flv','video/x-ms-wmv'];const fileName=file.name.toLowerCase();const isLikelyVideo=fileName.match(/\.(mp4|webm|ogg|mov|mkv|avi|flv|wmv|3gp|m4v)$/);const maxSize=10*1024*1024;if(!validTypes.includes(file.type)&&!isLikelyVideo){showMessage('不支持的文件类型，请上传图片或视频文件','error');return}
if(file.size>maxSize){showMessage('文件大小不能超过10MB','error');return}
currentMediaFile=file;previewMedia(file);removeMediaBtn.style.display='inline-flex';if(file.type.startsWith('video/')){videoCoverUpload.style.display='block';if(currentCoverFile){previewCover(currentCoverFile)}}else{videoCoverUpload.style.display='none';removeCover()}}
function handleCoverFileSelect(file){const validImageTypes=['image/jpeg','image/png','image/gif','image/webp'];const maxSize=5*1024*1024;if(!validImageTypes.includes(file.type)){showMessage('请上传图片文件作为封面','error');return}
if(file.size>maxSize){showMessage('封面图片大小不能超过5MB','error');return}
currentCoverFile=file;previewCover(file);removeCoverBtn.style.display='inline-flex'}
function previewCover(file){coverPreviewContainer.style.display='block';const reader=new FileReader();reader.onload=function(e){coverPreviewContent.innerHTML=`
            <div class="media-preview image-preview">
                <img src="${e.target.result}" alt="封面预览" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 2px solid rgba(255, 215, 0, 0.5);">
            </div>
            <div class="file-info">
                <p><strong>文件名:</strong> ${file.name}</p>
                <p><strong>类型:</strong> ${file.type}</p>
                <p><strong>大小:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        `};reader.readAsDataURL(file)}
function removeCover(){currentCoverFile=null;currentCoverUrl='';if(itemCoverImageInput)itemCoverImageInput.value='';if(coverPreviewContainer)coverPreviewContainer.style.display='none';if(removeCoverBtn)removeCoverBtn.style.display='none';if(coverPreviewContent)coverPreviewContent.innerHTML=''}
async function uploadCoverFile(file){try{const fileExt=file.name.split('.').pop();const fileName=`cover_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;const filePath=`item-media/${fileName}`;showCoverUploadProgress(0);const{data,error}=await supabase.storage.from('item-media').upload(filePath,file,{cacheControl:'3600',upsert:!1});if(error){throw error}
const{data:{publicUrl}}=supabase.storage.from('item-media').getPublicUrl(filePath);showCoverUploadProgress(100);return publicUrl}catch(error){console.error('封面文件上传失败:',error);showMessage('封面文件上传失败: '+error.message,'error');return null}}
function showCoverUploadProgress(percentage){if(!coverPreviewContent)return;if(percentage===100){coverPreviewContent.innerHTML=`
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 2rem; margin-bottom: 10px;"></i>
                <p style="color: #2ecc71;">封面上传完成！</p>
            </div>
        `;setTimeout(()=>{if(currentCoverFile){previewCover(currentCoverFile)}},1000);return}
if(percentage===0){coverPreviewContent.innerHTML=`
            <div style="text-align: center; padding: 20px; width: 100%;">
                <i class="fas fa-spinner fa-spin" style="color: gold; font-size: 2rem; margin-bottom: 15px;"></i>
                <p style="color: rgba(255, 215, 0, 0.9); margin-bottom: 10px;">正在上传封面...</p>
                <div class="upload-progress">
                    <div class="progress-bar" style="width: ${percentage}%">
                        <span class="progress-text">${percentage}%</span>
                    </div>
                </div>
            </div>
        `;return}
const progressBar=coverPreviewContent.querySelector('.progress-bar');const progressText=coverPreviewContent.querySelector('.progress-text');if(progressBar&&progressText){progressBar.style.width=`${percentage}%`;progressText.textContent=`${percentage}%`}}
function previewMedia(file){previewContainer.style.display='block';removeMediaBtn.style.display='inline-flex';previewContent.innerHTML='';const previewWrapper=document.createElement('div');previewWrapper.className='media-preview-wrapper';previewWrapper.style.cssText=`
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        border: 2px dashed rgba(255, 215, 0, 0.3);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
    `;const fileInfo=document.createElement('div');fileInfo.className='file-info';fileInfo.style.cssText=`
        margin-top: 15px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        width: 100%;
    `;fileInfo.innerHTML=`
        <p><strong>文件名:</strong> ${file.name}</p>
        <p><strong>类型:</strong> ${file.type}</p>
        <p><strong>大小:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
    `;if(file.type.startsWith('image/')){const reader=new FileReader();reader.onload=function(e){previewWrapper.innerHTML=`
                <div style="width: 100%; display: flex; justify-content: center;">
                    <img src="${e.target.result}" alt="预览" 
                         style="max-width: 100%; max-height: 300px; border-radius: 8px; 
                                border: 2px solid gold; object-fit: contain;">
                </div>
            `;previewContent.appendChild(previewWrapper);previewContent.appendChild(fileInfo)};reader.readAsDataURL(file);videoCoverUpload.style.display='none';removeCover()}else if(file.type.startsWith('video/')){previewWrapper.innerHTML=`
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; color: gold; margin-bottom: 15px;">
                    <i class="fas fa-video"></i>
                </div>
                <h3 style="color: gold; margin-bottom: 10px;">视频文件已选择</h3>
                <p style="color: rgba(255, 215, 0, 0.8); margin-bottom: 15px;">
                    文件名: ${file.name}
                </p>
                <p style="color: rgba(255, 215, 0, 0.7); font-size: 0.9rem;">
                    视频将在保存物品后上传到服务器。您可以为视频添加一个封面图片以增强展示效果。
                </p>
            </div>
        `;previewContent.appendChild(previewWrapper);previewContent.appendChild(fileInfo);videoCoverUpload.style.display='block';if(currentCoverFile){previewCover(currentCoverFile)}
try{const videoUrl=URL.createObjectURL(file);const testVideo=document.createElement('video');testVideo.style.display='none';testVideo.src=videoUrl;testVideo.preload='metadata';testVideo.onloadedmetadata=function(){const videoElement=document.createElement('video');videoElement.controls=!0;videoElement.preload='metadata';videoElement.style.cssText=`
                    max-width: 100%;
                    max-height: 300px;
                    border-radius: 8px;
                    border: 2px solid gold;
                    background: #000;
                `;const sourceElement=document.createElement('source');sourceElement.src=videoUrl;sourceElement.type=file.type;videoElement.appendChild(sourceElement);previewWrapper.innerHTML='';previewWrapper.appendChild(videoElement);videoElement.muted=!0;videoElement.play().then(()=>{setTimeout(()=>{videoElement.pause();videoElement.currentTime=0;videoElement.muted=!1},1000)}).catch(err=>{});setTimeout(()=>{URL.revokeObjectURL(videoUrl)},5000)};testVideo.onerror=function(e){console.error('视频测试加载失败:',e);const errorDiv=document.createElement('div');errorDiv.style.cssText=`
                    text-align: center;
                    padding: 20px;
                    color: #e74c3c;
                    background: rgba(231, 76, 60, 0.1);
                    border-radius: 8px;
                    margin-top: 10px;
                `;errorDiv.innerHTML=`
                    <p><i class="fas fa-exclamation-triangle"></i> 视频预览加载失败</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">
                        这可能是因为视频编码不被浏览器支持。<br>
                        您仍然可以保存此视频文件，它将在服务器端被正确处理。
                    </p>
                `;previewWrapper.appendChild(errorDiv);URL.revokeObjectURL(videoUrl)};testVideo.load()}catch(error){console.error('创建视频预览时出错:',error);const errorDiv=document.createElement('div');errorDiv.style.cssText=`
                text-align: center;
                padding: 15px;
                color: #e74c3c;
                background: rgba(231, 76, 60, 0.1);
                border-radius: 8px;
                margin-top: 10px;
            `;errorDiv.innerHTML=`
                <p><i class="fas fa-exclamation-circle"></i> 无法生成视频预览</p>
                <p style="font-size: 0.9rem;">
                    错误: ${error.message}<br>
                    您仍然可以继续上传此视频文件。
                </p>
            `;previewWrapper.appendChild(errorDiv)}}else{previewWrapper.innerHTML=`
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; color: gold; margin-bottom: 15px;">
                    <i class="fas fa-file"></i>
                </div>
                <h3 style="color: gold; margin-bottom: 10px;">${file.name}</h3>
                <p style="color: rgba(255, 215, 0, 0.8);">
                    不支持预览此文件类型
                </p>
            </div>
        `;previewContent.appendChild(previewWrapper);previewContent.appendChild(fileInfo);videoCoverUpload.style.display='none';removeCover()}}
function removeMedia(){currentMediaFile=null;currentMediaUrl='';if(itemMediaInput)itemMediaInput.value='';if(previewContainer)previewContainer.style.display='none';if(removeMediaBtn)removeMediaBtn.style.display='none';if(previewContent)previewContent.innerHTML=''}
async function uploadMediaFile(file){try{const fileExt=file.name.split('.').pop();const fileName=`${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;const filePath=`item-media/${fileName}`;showUploadProgress(0);const{data,error}=await supabase.storage.from('item-media').upload(filePath,file,{cacheControl:'3600',upsert:!1});if(error){throw error}
const{data:{publicUrl}}=supabase.storage.from('item-media').getPublicUrl(filePath);showUploadProgress(100);showMessage('文件上传成功','success');return publicUrl}catch(error){console.error('文件上传失败:',error);showMessage('文件上传失败: '+error.message,'error');return null}}
function showUploadProgress(percentage){if(!previewContent)return;if(percentage===100){previewContent.innerHTML=`
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 2rem; margin-bottom: 10px;"></i>
                <p style="color: #2ecc71;">上传完成！</p>
            </div>
        `;setTimeout(()=>{if(currentMediaFile){previewMedia(currentMediaFile)}},1000);return}
if(percentage===0){previewContent.innerHTML=`
            <div style="text-align: center; padding: 20px; width: 100%;">
                <i class="fas fa-spinner fa-spin" style="color: gold; font-size: 2rem; margin-bottom: 15px;"></i>
                <p style="color: rgba(255, 215, 0, 0.9); margin-bottom: 10px;">正在上传...</p>
                <div class="upload-progress">
                    <div class="progress-bar" style="width: ${percentage}%">
                        <span class="progress-text">${percentage}%</span>
                    </div>
                </div>
            </div>
        `;return}
const progressBar=previewContent.querySelector('.progress-bar');const progressText=previewContent.querySelector('.progress-text');if(progressBar&&progressText){progressBar.style.width=`${percentage}%`;progressText.textContent=`${percentage}%`}}
function bindEvents(){console.log('绑定事件...');resetSystemBtn?.addEventListener('click',async()=>{if(gameData.currentUser?.role!=='admin'){showMessage('只有GM可以执行此操作','error');return}
const confirmation=prompt('⚠️ 危险操作警告 ⚠️\n\n'+'此操作将永久清空以下数据：\n'+'• 所有用户的金币、仓库、开盒记录\n'+'• 所有聊天记录\n'+'• 全局开盒记录\n'+'• 重置所有物品数量\n'+'• 重置盲盒轮次\n\n'+'此操作不可恢复！\n\n'+'请输入 "清空系统数据" 以确认操作：');if(confirmation!=='清空系统数据'){showMessage('操作已取消','info');return}
await resetSystemData('all')});resetAllItemsBtn?.addEventListener('click',()=>{resetAllItems()});resetToDefaultBtn?.addEventListener('click',()=>{resetToDefault()});if(panelResetUnopenedBtn){panelResetUnopenedBtn.addEventListener('click',()=>{resetUnopenedBoxes();closeAdminPanel()})}
navLinks.forEach(link=>{link.addEventListener('click',(e)=>{e.preventDefault();const page=link.getAttribute('data-page');currentPage=page;showPage(page);navLinks.forEach(l=>l.classList.remove('active'));link.classList.add('active')})});navLinks.forEach(link=>{link.addEventListener('click',(e)=>{e.preventDefault();const page=link.getAttribute('data-page');currentPage=page;showPage(page);navLinks.forEach(l=>l.classList.remove('active'));link.classList.add('active')})});loginModalBtn.addEventListener('click',()=>loginModal.classList.add('active'));closeLoginModal.addEventListener('click',()=>loginModal.classList.remove('active'));loginBtn.addEventListener('click',handleLogin);logoutBtn.addEventListener('click',handleLogout);registerModalBtn.addEventListener('click',()=>registerModal.classList.add('active'));closeRegisterModal.addEventListener('click',()=>registerModal.classList.remove('active'));registerBtn.addEventListener('click',handleRegister);goToRegisterFromLogin.addEventListener('click',(e)=>{e.preventDefault();loginModal.classList.remove('active');registerModal.classList.add('active')});goToLoginFromRegister.addEventListener('click',(e)=>{e.preventDefault();registerModal.classList.remove('active');loginModal.classList.add('active')});refreshCoinOperationsBtn?.addEventListener('click',()=>{coinOperationsCurrentPage=1;updateCoinOperationsDisplay();showMessage('金币操作记录已刷新','success')});coinOperationsFilterUser?.addEventListener('change',updateCoinOperationsDisplay);coinOperationsFilterType?.addEventListener('change',updateCoinOperationsDisplay);document.getElementById('coinOperationsPrevPage')?.addEventListener('click',goToCoinOperationsPrevPage);document.getElementById('coinOperationsNextPage')?.addEventListener('click',goToCoinOperationsNextPage);document.getElementById('coinOperationsPageSize')?.addEventListener('change',changeCoinOperationsPageSize);coinOperationsFilterUser?.addEventListener('change',()=>{coinOperationsCurrentPage=1;updateCoinOperationsDisplay()});coinOperationsFilterType?.addEventListener('change',()=>{coinOperationsCurrentPage=1;updateCoinOperationsDisplay()});coinOperationsFilterDate?.addEventListener('change',()=>{coinOperationsCurrentPage=1;updateCoinOperationsDisplay()});document.getElementById('sendChatMessageBtn')?.addEventListener('click',sendChatMessage);document.getElementById('chatMessageInput')?.addEventListener('keypress',(e)=>{if(e.key==='Enter'){e.preventDefault();sendChatMessage()}});document.getElementById('loginFromChat')?.addEventListener('click',()=>loginModal.classList.add('active'));document.getElementById('registerFromChat')?.addEventListener('click',()=>registerModal.classList.add('active'));document.getElementById('loginFromHome')?.addEventListener('click',()=>loginModal.classList.add('active'));document.getElementById('loginFromWarehouse')?.addEventListener('click',()=>loginModal.classList.add('active'));document.getElementById('loginFromHistory')?.addEventListener('click',()=>loginModal.classList.add('active'));document.getElementById('loginFromProfile')?.addEventListener('click',()=>loginModal.classList.add('active'));document.getElementById('loginFromAdmin')?.addEventListener('click',()=>loginModal.classList.add('active'));registerFromHome?.addEventListener('click',()=>registerModal.classList.add('active'));registerFromWarehouse?.addEventListener('click',()=>registerModal.classList.add('active'));registerFromHistory?.addEventListener('click',()=>registerModal.classList.add('active'));registerFromProfile?.addEventListener('click',()=>registerModal.classList.add('active'));navLinks.forEach(link=>{link.addEventListener('click',(e)=>{e.preventDefault();const page=link.getAttribute('data-page');showPage(page);navLinks.forEach(l=>l.classList.remove('active'));link.classList.add('active')})});if(uploadCoverBtn){uploadCoverBtn.addEventListener('click',()=>itemCoverImageInput.click())}
if(uploadCoverArea){uploadCoverArea.addEventListener('click',()=>itemCoverImageInput.click());['dragenter','dragover','dragleave','drop'].forEach(eventName=>{uploadCoverArea.addEventListener(eventName,preventDefaults,!1)});function preventDefaults(e){e.preventDefault();e.stopPropagation()}['dragenter','dragover'].forEach(eventName=>{uploadCoverArea.addEventListener(eventName,highlightCover,!1)});['dragleave','drop'].forEach(eventName=>{uploadCoverArea.addEventListener(eventName,unhighlightCover,!1)});function highlightCover(){uploadCoverArea.parentElement.classList.add('drag-over')}
function unhighlightCover(){uploadCoverArea.parentElement.classList.remove('drag-over')}
uploadCoverArea.addEventListener('drop',handleCoverDrop,!1);function handleCoverDrop(e){const dt=e.dataTransfer;const files=dt.files;if(files.length>0){handleCoverFileSelect(files[0])}}}
if(itemCoverImageInput){itemCoverImageInput.addEventListener('change',(e)=>{if(e.target.files.length>0){handleCoverFileSelect(e.target.files[0])}})}
if(removeCoverBtn){removeCoverBtn.addEventListener('click',removeCover)}
sidebarMenuItems.forEach(item=>{item.addEventListener('click',(e)=>{e.preventDefault();const page=item.getAttribute('data-page');showPage(page);sidebarMenuItems.forEach(i=>i.classList.remove('active'));item.classList.add('active');navLinks.forEach(l=>{l.classList.remove('active');if(l.getAttribute('data-page')===page){l.classList.add('active')}})})});addUserBtn?.addEventListener('click',()=>{userModalTitle.textContent='创建新用户';clearUserForm();userModal.classList.add('active')});modifyCoinsBtn?.addEventListener('click',()=>{populateCoinsUserSelect();const operation=document.getElementById('coinsOperation').value;const coinsAmount=document.getElementById('coinsAmount');if(operation==='add'){coinsAmount.value=20000}else if(operation==='set'){coinsAmount.value=0}else{coinsAmount.value=20000}
const searchInput=document.getElementById('searchUsernameInput');if(searchInput){searchInput.value=''}
populateCoinsUserSelect();modifyCoinsModal.classList.add('active')});approveUsersBtn?.addEventListener('click',()=>{updateAdminData();showMessage('已筛选显示待审批用户','info')});closeUserModal?.addEventListener('click',()=>userModal.classList.remove('active'));saveUserBtn?.addEventListener('click',saveUser);closeItemModal?.addEventListener('click',()=>itemModal.classList.remove('active'));saveItemBtn?.addEventListener('click',saveItem);closeModifyCoinsModal?.addEventListener('click',()=>modifyCoinsModal.classList.remove('active'));modifyCoinsConfirmBtn?.addEventListener('click',modifyCoins);updateProfileBtn?.addEventListener('click',updateProfile);closeResultModal?.addEventListener('click',()=>closeResultModalFunc());closeResultModalBtn?.addEventListener('click',()=>closeResultModalFunc());resetAllItemsBtn?.addEventListener('click',()=>{if(confirm('确定要重置所有物品数量吗？')){resetAllItems();showMessage('所有物品数量已重置','success')}});resetToDefaultBtn?.addEventListener('click',()=>{if(confirm('确定要重置所有物品为默认数量吗？')){resetToDefault()}});if(panelResetByValueBtn){panelResetByValueBtn.addEventListener('click',async()=>{const targetValue=parseInt(targetValueInput.value);if(!targetValue||targetValue<=0){showMessage('请输入有效的目标','error');return}
const result=await resetUnopenedBoxesByValue(targetValue);if(result.success){showMessage(result.message,'success')}else{showMessage(result.message,'error')}
closeAdminPanel()})}
if(adminResetByValueBtn){adminResetByValueBtn.addEventListener('click',async()=>{const targetValue=parseInt(adminTargetValueInput.value);if(!targetValue||targetValue<=0){showMessage('请输入有效的目标','error');return}
const result=await resetUnopenedBoxesByValue(targetValue);if(result.success){showMessage(result.message,'success')}else{showMessage(result.message,'error')}})}
if(adminResetByValueBtn){adminResetByValueBtn.addEventListener('click',async()=>{const targetValue=parseInt(adminTargetValueInput.value);if(!targetValue||targetValue<=0){showMessage('请输入有效的目标','error');return}
if(confirm(`确定 ${targetValue}（允许±10%偏差）重置？`)){const result=await resetUnopenedBoxesByValue(targetValue);if(result.success){showMessage(result.message,'success')}else{showMessage(result.message,'error')}}})}
const searchInput=document.getElementById('searchUsernameInput');if(searchInput){searchInput.addEventListener('input',(e)=>{const keyword=e.target.value;populateCoinsUserSelect(keyword)})}
const clearSearchBtn=document.getElementById('clearSearchBtn');if(clearSearchBtn){clearSearchBtn.addEventListener('click',()=>{if(searchInput){searchInput.value='';populateCoinsUserSelect()}})}
const coinsOperationSelect=document.getElementById('coinsOperation');if(coinsOperationSelect){coinsOperationSelect.addEventListener('change',function(){const operation=this.value;const coinsAmountInput=document.getElementById('coinsAmount');if(operation==='add'||operation==='gift'){coinsAmountInput.value=20000}else if(operation==='set'){coinsAmountInput.value=0}else{coinsAmountInput.value=''}})}
refreshGlobalHistoryBtn?.addEventListener('click',()=>{updateGlobalHistoryDisplay();showMessage('全局开盒记录已刷新','success')});clearGlobalHistoryBtn?.addEventListener('click',async()=>{try{const{error}=await supabase.from('user_history').delete().neq('id',0);if(error)throw error;gameData.userHistory=[];updateGlobalHistoryDisplay();updateHistoryDisplay();showMessage('所有开盒记录已清空','success')}catch(error){console.error('Error clearing history:',error);showMessage('清空记录失败','error')}});userWarehouseSelect?.addEventListener('change',function(){const userId=parseInt(this.value);if(userId){showUserWarehouse(userId)}else{selectedUserWarehouse.style.display='none'}});if(adminPanelToggle){adminPanelToggle.addEventListener('click',toggleAdminPanel)}
if(panelModifyCoinsBtn){panelModifyCoinsBtn?.addEventListener('click',()=>{populateCoinsUserSelect();const operation=document.getElementById('coinsOperation').value;const coinsAmount=document.getElementById('coinsAmount');if(operation==='add'){coinsAmount.value=20000}else if(operation==='set'){coinsAmount.value=0}else{coinsAmount.value=''}
const searchInput=document.getElementById('searchUsernameInput');if(searchInput){searchInput.value=''}
populateCoinsUserSelect();modifyCoinsModal.classList.add('active');closeAdminPanel()})}
if(panelApproveUsersBtn){panelApproveUsersBtn.addEventListener('click',()=>{updateAdminData();showMessage('已筛选显示待审批用户','info');closeAdminPanel()})}
if(panelAddItemBtn){panelAddItemBtn.addEventListener('click',()=>{itemModalTitle.textContent='添加新物品';clearItemForm();itemModal.classList.add('active');closeAdminPanel()})}
if(panelResetItemsBtn){panelResetItemsBtn.addEventListener('click',()=>{if(confirm('确定要重置所有物品数量吗？')){resetAllItems();showMessage('所有物品数量已重置','success')}
closeAdminPanel()})}
if(panelResetDefaultBtn){panelResetDefaultBtn.addEventListener('click',()=>{if(confirm('确定要重置所有物品为默认数量吗？')){resetToDefault()}
closeAdminPanel()})}
if(panelResetUnopenedBtn){panelResetUnopenedBtn.addEventListener('click',()=>{if(confirm('确定要重置。')){resetUnopenedBoxes();showMessage('已重置','success')}
closeAdminPanel()})}
if(panelRefreshHistoryBtn){panelRefreshHistoryBtn.addEventListener('click',()=>{updateGlobalHistoryDisplay();showMessage('全局开盒记录已刷新','success');closeAdminPanel()})}
if(panelClearHistoryBtn){panelClearHistoryBtn.addEventListener('click',async()=>{try{const{error}=await supabase.from('user_history').delete().neq('id',0);if(error)throw error;gameData.userHistory=[];updateGlobalHistoryDisplay();updateHistoryDisplay();showMessage('所有开盒记录已清空','success')}catch(error){console.error('Error clearing history:',error);showMessage('清空记录失败','error')}
closeAdminPanel()})}
if(panelViewWarehouseBtn){panelViewWarehouseBtn.addEventListener('click',()=>{if(userWarehouseSelect){userWarehouseSelect.focus();const warehouseView=document.querySelector('.user-warehouse-view');if(warehouseView){warehouseView.scrollIntoView({behavior:'smooth'})}}
closeAdminPanel()})}
if(closeEditBoxItemModal){closeEditBoxItemModal.addEventListener('click',()=>editBoxItemModal.classList.remove('active'))}
if(saveBoxItemBtn){saveBoxItemBtn.addEventListener('click',saveBoxItem)}
if(boxItemSelect){boxItemSelect.addEventListener('change',updateNewItemPreview)}
window.addEventListener('click',(e)=>{if(e.target===loginModal)loginModal.classList.remove('active');if(e.target===registerModal)registerModal.classList.remove('active');if(e.target===userModal)userModal.classList.remove('active');if(e.target===itemModal)itemModal.classList.remove('active');if(e.target===modifyCoinsModal)modifyCoinsModal.classList.remove('active');if(e.target===resultModal)closeResultModalFunc();if(e.target===redeemConfirmModal)redeemConfirmModal.classList.remove('active');if(e.target===editBoxItemModal)editBoxItemModal.classList.remove('active');if(adminPanelExpanded&&!adminPanelDrawer.contains(e.target)&&e.target!==adminPanelToggle){window.addEventListener('beforeunload',function(){if(gameData.currentUser){supabase.from('users').update({last_active:new Date(Date.now()-60000).toISOString()}).eq('id',gameData.currentUser.id).then()}
stopHeartbeat()});closeAdminPanel()}});console.log('事件绑定完成')}
function toggleAdminPanel(){if(adminPanelExpanded){closeAdminPanel()}else{openAdminPanel()}}
function openAdminPanel(){adminPanelContent.classList.add('expanded');adminPanelIcon.style.transform='rotate(-90deg)';adminPanelExpanded=!0}
function closeAdminPanel(){adminPanelContent.classList.remove('expanded');adminPanelIcon.style.transform='rotate(0deg)';adminPanelExpanded=!1}
function closeResultModalFunc(){resultModal.classList.remove('active');if(resultModalAutoCloseTimer){clearInterval(resultModalAutoCloseTimer);resultModalAutoCloseTimer=null}
isBoxOpening=!1;enableAllBoxes()}
function enableAllBoxes(){const allBoxes=document.querySelectorAll('.treasure-box');allBoxes.forEach(box=>{if(!box.classList.contains('opened')){box.style.cursor='pointer';box.style.opacity='1'}})}
function updateLastResetDate(){if(gameData.systemSettings.last_reset){const date=new Date(gameData.systemSettings.last_reset);lastResetDate.textContent=date.toLocaleString()}else{lastResetDate.textContent='无'}}
function createCoinRain(){const coinCount=30;for(let i=0;i<coinCount;i++){setTimeout(()=>{const coin=document.createElement('div');coin.className='coin';coin.style.left=Math.random()*100+'vw';coin.style.animationDuration=(Math.random()*3+2)+'s';coin.style.width=(Math.random()*15+10)+'px';coin.style.height=coin.style.width;document.body.appendChild(coin);setTimeout(()=>{coin.remove()},5000)},i*300)}
setTimeout(createCoinRain,10000)}
function showPage(page){console.log(`切换到页面: ${page}`);currentPage=page;contentSections.forEach(section=>{section.classList.remove('active')});const targetSection=document.getElementById(`${page}-section`);if(targetSection){targetSection.classList.add('active');updatePageVisibility(page);switch(page){case 'chat':if(gameData.currentUser){document.getElementById('chatContent').style.display='block';document.getElementById('chatLoginRequired').style.display='none';const messagesList=document.getElementById('chatMessagesList');if(messagesList){messagesList.innerHTML='<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> 加载聊天记录...</div>'}
refreshChatMessages().then(()=>{renderChatMessages();unreadChatCount=0;updateChatUnreadBadge();updateOnlineUsersList().then(()=>renderOnlineUsers())}).catch(err=>{console.error('刷新聊天失败:',err);if(messagesList){messagesList.innerHTML='<div style="text-align:center; padding:20px; color:#e74c3c;">加载聊天记录失败</div>'}})}else{document.getElementById('chatContent').style.display='none';document.getElementById('chatLoginRequired').style.display='block'}
break;case 'admin':if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin')){setTimeout(()=>{updateAdminData();updateGlobalHistoryDisplay();populateUserWarehouseSelect();updateAdminHomeStats();updateCoinOperationsDisplay()},100)}
if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin()}else{renderTreasureBoxes()}
updateRoundStats();break}}}
function updatePageVisibility(page){if(gameData.currentUser&&gameData.currentUser.is_active===!1){showMessage('您的账户已被管理员禁用','error');handleLogout();return}
const loginRequired=document.getElementById(`${page}LoginRequired`);let contentArea;switch(page){case 'admin':contentArea=document.getElementById('adminContent');break;case 'home':contentArea=document.getElementById('gameArea');break;case 'warehouse':contentArea=document.getElementById('warehouseContainer');break;case 'history':contentArea=document.getElementById('historyContainer');break;case 'profile':contentArea=document.getElementById('profileForm');break;case 'chat':if(contentArea)contentArea.style.display='block';break;default:contentArea=null}
const allLoginRequired=document.querySelectorAll('.login-restriction');allLoginRequired.forEach(el=>{el.style.display='none'});if(!gameData.currentUser){if(loginRequired)loginRequired.style.display='block';if(contentArea)contentArea.style.display='none';document.getElementById('sidebar').style.display='none';adminPanelDrawer.style.display='none';if(page==='home'){const loginRequiredHome=document.getElementById('loginRequired');if(loginRequiredHome){loginRequiredHome.style.display='block'}}}else{if(loginRequired)loginRequired.style.display='none';if(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'){handleAdminPageVisibility(page,contentArea)}else{handleUserPageVisibility(page,contentArea)}}}
function handleAdminPageVisibility(page,contentArea){document.getElementById('sidebar').style.display='block';adminPanelDrawer.style.display='block';if(gameData.currentUser.role==='admin'){adminPanelItemsSection.style.display='block';adminPanelBoxesSection.style.display='block';adminPanelHistorySection.style.display='block';adminSubtitle.textContent='GM专用面板'}else if(gameData.currentUser.role==='subadmin'){adminPanelItemsSection.style.display='none';adminPanelBoxesSection.style.display='none';adminPanelHistorySection.style.display='none';adminSubtitle.textContent='管理员专用面板'}
switch(page){case 'admin':if(contentArea)contentArea.style.display='block';updateAdminData();updateGlobalHistoryDisplay();populateUserWarehouseSelect();break;case 'home':const gameArea=document.getElementById('gameArea');const loginRequiredHome=document.getElementById('loginRequired');if(loginRequiredHome){loginRequiredHome.style.display='none'}
if(gameArea){gameArea.style.display='block'}
if(adminHomeStats){if(gameData.currentUser.role==='admin'){adminHomeStats.style.display='grid'}else if(gameData.currentUser.role==='subadmin'){adminHomeStats.style.display='none'}}
if(gameData.currentUser.role==='admin'){if(adminBoxesPreview){adminBoxesPreview.style.display='block'}
if(subadminBoxesPreview){subadminBoxesPreview.style.display='none'}
if(blindBoxesGrid&&blindBoxesGrid.innerHTML===''){renderTreasureBoxesForAdmin()}else{renderTreasureBoxesForAdmin()}}else{if(adminBoxesPreview){adminBoxesPreview.style.display='none'}
if(subadminBoxesPreview){subadminBoxesPreview.style.display='block'}
if(blindBoxesGrid&&blindBoxesGrid.innerHTML===''){renderTreasureBoxesForSubadmin()}else{renderTreasureBoxesForSubadmin()}}
if(gameData.currentUser.role==='admin'){updateAdminHomeStats()}
updateRoundStats();break;case 'warehouse':if(contentArea)contentArea.style.display='block';break;case 'history':if(contentArea)contentArea.style.display='block';updateHistoryDisplay();break;case 'profile':if(contentArea)contentArea.style.display='block';populateProfileForm();break}}
function handleUserPageVisibility(page,contentArea){if(contentArea){contentArea.style.display='block'}
document.getElementById('sidebar').style.display='block';adminPanelDrawer.style.display='none';const adminHomeStats=document.getElementById('adminHomeStats');const adminBoxesPreview=document.getElementById('adminBoxesPreview');const subadminBoxesPreview=document.getElementById('subadminBoxesPreview');if(adminHomeStats)adminHomeStats.style.display='none';if(adminBoxesPreview)adminBoxesPreview.style.display='none';if(subadminBoxesPreview)subadminBoxesPreview.style.display='none';switch(page){case 'warehouse':updateWarehouseDisplay();break;case 'history':updateHistoryDisplay();break;case 'profile':populateProfileForm();break;case 'admin':console.log('用户试图访问管理页面');const adminLoginRequired=document.getElementById('adminLoginRequired');if(adminLoginRequired){adminLoginRequired.style.display='block'}
if(contentArea){contentArea.style.display='none'}
break;case 'home':const gameArea=document.getElementById('gameArea');if(gameArea){gameArea.style.display='block'}
renderTreasureBoxes();updateRoundStats();break}}
function getMediaType(url){if(!url)return null;const imageExtensions=['.jpg','.jpeg','.png','.gif','.webp'];const videoExtensions=['.mp4','.webm','.ogg','.mov'];const lowerUrl=url.toLowerCase();for(const ext of imageExtensions){if(lowerUrl.includes(ext))return'image'}
for(const ext of videoExtensions){if(lowerUrl.includes(ext))return'video'}
return'unknown'}
function renderTreasureBoxesForAdmin(){if(!blindBoxesGrid)return;blindBoxesGrid.innerHTML='';gameData.globalRound.boxes.forEach((box)=>{const boxElement=document.createElement('div');boxElement.className=box.isOpened?'treasure-box admin-opened':'treasure-box';boxElement.dataset.boxId=box.id;let boxLabel=box.isOpened?'✓':'';let boxSubtitle=box.isOpened?'已开启':'未开启';let presetItemName='空盒';let presetItemValue=0;let presetItemRarity='common';let displayContent='📦';if(box.presetItemId!==null&&box.presetItemId!==0){const presetItem=gameData.items.find(item=>item.id===box.presetItemId);if(presetItem){presetItemName=presetItem.name;presetItemValue=presetItem.value;presetItemRarity=presetItem.rarity;const displayUrl=presetItem.cover_url||(presetItem.media_url&&presetItem.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)?presetItem.media_url:null);if(displayUrl){displayContent=`<img src="${displayUrl}" alt="${presetItemName}" 
                        style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; border: 2px solid ${getRarityColor(presetItemRarity)};">`}else{displayContent=presetItem.icon||'🎁'}}}
boxElement.innerHTML=`
            <div class="box-glow"></div>
            <div class="box-decoration">
                <div class="box-corner corner-tl"></div>
                <div class="box-corner corner-tr"></div>
                <div class="box-corner corner-bl"></div>
                <div class="box-corner corner-br"></div>
            </div>
            <div class="treasure-box-lid"></div>
            <div class="treasure-box-body"></div>
            <div class="box-content">
                <div class="box-label">${boxLabel}</div>
                <div class="box-subtitle">${boxSubtitle}</div>
            </div>
            <div class="box-number">${box.id}</div>
            <div class="box-preset-item" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                ${displayContent}
            </div>
            <div class="preset-item-tooltip">
                <strong>${presetItemName}</strong><br>
                价值: ${presetItemValue} 金币<br>
                稀有度: ${getRarityText(presetItemRarity)}
            </div>
        `;if(!box.isOpened){boxElement.style.cursor='pointer';boxElement.addEventListener('click',()=>showBoxItemEditModal(box.id))}
blindBoxesGrid.appendChild(boxElement)})}
function renderTreasureBoxesForSubadmin(){if(!blindBoxesGrid)return;blindBoxesGrid.innerHTML='';gameData.globalRound.boxes.forEach((box)=>{const boxElement=document.createElement('div');boxElement.className=box.isOpened?'treasure-box admin-opened':'treasure-box';boxElement.dataset.boxId=box.id;let boxLabel=box.isOpened?'✓':'';let boxSubtitle=box.isOpened?'已开启':'未开启';boxElement.innerHTML=`
            <div class="box-glow"></div>
            <div class="box-decoration">
                <div class="box-corner corner-tl"></div>
                <div class="box-corner corner-tr"></div>
                <div class="box-corner corner-bl"></div>
                <div class="box-corner corner-br"></div>
            </div>
            <div class="treasure-box-lid"></div>
            <div class="treasure-box-body"></div>
            <div class="box-content">
                <div class="box-label">${boxLabel}</div>
                <div class="box-subtitle">${boxSubtitle}</div>
            </div>
            <div class="box-number">${box.id}</div>
        `;if(box.isOpened&&box.openedBy){const openerName=getUsernameById(box.openedBy);const openerInfo=document.createElement('div');openerInfo.className='box-opener-info';openerInfo.textContent=`开启者: ${openerName}`;boxElement.appendChild(openerInfo)}
boxElement.style.cursor='default';blindBoxesGrid.appendChild(boxElement)})}
function showBoxItemEditModal(boxId){const box=gameData.globalRound.boxes.find(b=>b.id===boxId);if(!box)return;if(box.isOpened){return}
currentEditingBoxId=boxId;editBoxNumber.textContent=box.id;let currentItemIcon='📦';let currentItemName='空盒';let currentItemValue=0;let currentItemRarity='common';let currentItemDescription='空盒（无奖品）';let currentItemImage='📦';if(box.presetItemId!==null&&box.presetItemId!==0){const presetItem=gameData.items.find(item=>item.id===box.presetItemId);if(presetItem){currentItemIcon=presetItem.icon;currentItemName=presetItem.name;currentItemValue=presetItem.value;currentItemRarity=presetItem.rarity;currentItemDescription=presetItem.description;let displayUrl=presetItem.cover_url||presetItem.media_url;const isImage=displayUrl&&displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);if(isImage){currentItemImage=`<img src="${displayUrl}" alt="${presetItem.name}" style="max-width: 100px; max-height: 100px; border-radius: 8px;">`}else{currentItemImage=`<div style="font-size: 3rem;">${currentItemIcon}</div>`}}}else{currentItemImage='<div style="font-size: 3rem;">📦</div>'}
const rarityText=getRarityText(currentItemRarity);const rarityColor=getRarityColor(currentItemRarity);currentItemInfo.innerHTML=`
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 2.5rem; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background: ${rarityColor}20; border: 2px solid ${rarityColor}; border-radius: 10px;">
                ${currentItemImage}
            </div>
            <div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #FFD700;">${currentItemName}</div>
                <div style="color: ${rarityColor}; font-weight: bold; margin-bottom: 5px;">${rarityText} 物品</div>
                <div>价值: ${currentItemValue} 金币</div>
                <div>描述: ${currentItemDescription}</div>
            </div>
        </div>
    `;boxItemSelect.innerHTML='<option value="0">空盒 (无奖品)</option>';const rarityOrder={'legendary':5,'epic':4,'rare':3,'uncommon':2,'common':1};const availableItems=gameData.items.filter(item=>item.remaining>0);availableItems.sort((a,b)=>{return rarityOrder[a.rarity]-rarityOrder[b.rarity]});availableItems.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=`${item.icon} ${item.name} (${getRarityText(item.rarity)} - ${item.value}金币) 剩余:${item.remaining}`;if(box.presetItemId===item.id){option.selected=!0}
boxItemSelect.appendChild(option)});updateNewItemPreview();editBoxItemModal.classList.add('active')}
function updateNewItemPreview(){const selectedItemId=parseInt(boxItemSelect.value);if(selectedItemId===0){newItemPreview.innerHTML=`
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="font-size: 3rem;">📦</div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #FFD700;">空盒</div>
                <div>无奖品</div>
            </div>
        `;return}
const item=gameData.items.find(i=>i.id===selectedItemId);if(!item)return;const rarityText=getRarityText(item.rarity);const rarityColor=getRarityColor(item.rarity);let displayContent='';let displayUrl=item.cover_url||item.media_url;const isImage=displayUrl&&displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);if(isImage){displayContent=`<img src="${displayUrl}" alt="${item.name}" style="max-width: 150px; max-height: 150px; border-radius: 10px; border: 3px solid ${rarityColor};">`}else{displayContent=`<div style="font-size: 4rem; color: ${rarityColor}">${item.icon}</div>`}
newItemPreview.innerHTML=`
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 15px;">
            <div style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; background: ${rarityColor}20; border: 2px solid ${rarityColor}; border-radius: 10px;">
                ${displayContent}
            </div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #FFD700;">${item.name}</div>
            <div style="color: ${rarityColor}; font-weight: bold;">${rarityText} 物品</div>
            <div>价值: ${item.value} 金币</div>
            <div>剩余数量: ${item.remaining}/${item.total_limit}</div>
            ${item.description ? `<div style="margin-top: 10px; color: rgba(255, 215, 0, 0.8); font-size: 0.9rem;">描述:${item.description}</div>` : ''}
        </div>
    `}
async function saveBoxItem(){if(!currentEditingBoxId)return;const box=gameData.globalRound.boxes.find(b=>b.id===currentEditingBoxId);const selectedItemId=parseInt(boxItemSelect.value);const oldItemId=box.presetItemId;const oldItem=oldItemId!==0&&oldItemId!==null?gameData.items.find(i=>i.id===oldItemId):null;const newItem=selectedItemId!==0?gameData.items.find(i=>i.id===selectedItemId):null;if(newItem&&oldItemId!==selectedItemId){if(newItem.remaining<=0){showMessage(`物品 ${newItem.name} 数量不足，无法分配到宝盒中`,'error');return}}
try{if(oldItem&&oldItemId!==selectedItemId){const oldRemaining=oldItem.remaining+1;await supabase.from('items').update({remaining:oldRemaining}).eq('id',oldItem.id);oldItem.remaining=oldRemaining}
if(newItem&&oldItemId!==selectedItemId){const newRemaining=newItem.remaining-1;await supabase.from('items').update({remaining:newRemaining}).eq('id',newItem.id);newItem.remaining=newRemaining}
box.presetItemId=selectedItemId;await saveRoundToSupabase(gameData.globalRound);renderTreasureBoxesForAdmin();let message='';if(selectedItemId===0){message=`宝盒 #${box.id} 已设置为空盒`;if(oldItem){message+=`，物品 ${oldItem.name} 已放回物品池`}}else{const item=gameData.items.find(i=>i.id===selectedItemId);if(item){message=` #${box.id} 已更换为 ${item.name} (${item.value}金币)`;if(oldItem){message+=`，物品 ${oldItem.name} 物品池`}}}
showMessage(message,'success');editBoxItemModal.classList.remove('active');currentEditingBoxId=null;updateAdminHomeStats();if(document.getElementById('admin-section').classList.contains('active')){updateAdminData()}}catch(error){console.error('保存失败:',error);showMessage('保存失败，请稍后重试','error')}}
function updateAdminHomeStats(){if(!gameData.currentUser||(gameData.currentUser.role!=='admin'&&gameData.currentUser.role!=='subadmin'))return;adminTotalUsersHome.textContent=gameData.users.length;const openedCount=gameData.globalRound.boxes.filter(box=>box.isOpened).length;adminOpenedBoxesHome.textContent=openedCount;adminRemainingBoxesHome.textContent=50-openedCount;const progress=(openedCount/50*100).toFixed(0);adminRoundProgressHome.textContent=`${progress}%`;const{totalValue,remainingValue}=calculateBoxValues();adminTotalValueHome.textContent=totalValue;adminRemainingValueHome.textContent=remainingValue}
function populateUserWarehouseSelect(){if(!userWarehouseSelect)return;userWarehouseSelect.innerHTML='<option value="">请选择用户</option>';const regularUsers=gameData.users.filter(user=>user.role==='user'&&user.approved);regularUsers.forEach(user=>{const option=document.createElement('option');option.value=user.id;option.textContent=`${user.username} (ID: ${user.id})`;userWarehouseSelect.appendChild(option)})}
async function showUserWarehouse(userId){const user=gameData.users.find(u=>u.id===userId);if(!user)return;selectedUserName.textContent=user.username;const userHistory=(gameData.userHistory||[]).filter(record=>record.user_id===userId&&record.item_id!==0);const totalItems=userHistory.length;const totalValue=userHistory.reduce((sum,r)=>sum+(r.value||0),0);selectedUserItemCount.textContent=`${totalItems}件 · 总价值 ${totalValue} 金币`;const itemsContainer=document.getElementById('selectedUserWarehouseItems');itemsContainer.innerHTML='';if(userHistory.length===0){itemsContainer.innerHTML='<div style="text-align:center; padding:20px;">暂无开盒记录</div>';selectedUserWarehouse.style.display='block';return}
const itemMap=new Map();userHistory.forEach(record=>{const itemId=record.item_id;if(!itemMap.has(itemId)){const item=gameData.items.find(i=>i.id===itemId);if(item){itemMap.set(itemId,{item:item,quantity:1,totalValue:item.value})}}else{const entry=itemMap.get(itemId);entry.quantity+=1;entry.totalValue+=entry.item.value}});const groupedItems=Array.from(itemMap.values()).sort((a,b)=>{const rarityOrder={'legendary':5,'epic':4,'rare':3,'uncommon':2,'common':1};return(rarityOrder[b.item.rarity]||0)-(rarityOrder[a.item.rarity]||0)});itemsContainer.innerHTML=groupedItems.map(entry=>{const item=entry.item;const quantity=entry.quantity;const totalValue=entry.totalValue;const rarityColor=getRarityColor(item.rarity);let mediaHtml='';const displayUrl=item.cover_url||(item.media_url&&/\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url)?item.media_url:null);if(displayUrl){mediaHtml=`<img src="${displayUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 2px solid ${rarityColor};">`}else{mediaHtml=`<div style="font-size: 2rem;">${item.icon || '🎁'}</div>`}
return `
            <div class="user-warehouse-item" style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid rgba(255,215,0,0.2); align-items: center;">
                <div style="min-width: 60px; text-align: center;">
                    ${mediaHtml}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #FFD700;">${item.name}</div>
                    <div style="font-size: 0.9rem; color: ${rarityColor};">${getRarityText(item.rarity)}</div>
                    <div style="font-size: 0.85rem;">单件价值: ${item.value} 金币</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: bold; color: #FFD700;">×${quantity}</div>
                    <div style="font-size: 0.8rem;">总价值: ${totalValue} 金币</div>
                </div>
            </div>
        `}).join('');selectedUserWarehouse.style.display='block'}
async function handleRegister(){const username=document.getElementById('registerUsername').value;const password=document.getElementById('registerPassword').value;const passwordConfirm=document.getElementById('registerPasswordConfirm').value;const email=document.getElementById('registerEmail').value;if(!username||!password||!email){showMessage('请输入用户名、密码和邮箱','error');return}
if(password!==passwordConfirm){showMessage('两次输入的密码不一致','error');return}
try{const{data,error}=await supabase.rpc('register_user',{p_username:username,p_email:email,p_password:password});if(error){console.error('注册函数调用失败:',error);showMessage('注册失败，请稍后重试','error');return}
let result;try{result=typeof data==='string'?JSON.parse(data):data}catch(e){console.error('解析返回数据失败:',e,data);showMessage('注册失败，服务器返回数据格式错误','error');return}
if(!result.success){showMessage(result.message,'error');return}
registerModal.classList.remove('active');clearRegisterForm();showMessage('注册成功！请等待管理员审批。审批通过后即可登录。','success')}catch(error){console.error('注册失败:',error);showMessage('注册失败，请稍后重试','error')}}
document.getElementById('registerUsername')?.addEventListener('blur',checkRegisterUsername);document.getElementById('registerEmail')?.addEventListener('blur',checkRegisterEmail);async function checkRegisterUsername(){const usernameInput=document.getElementById('registerUsername');const username=usernameInput.value.trim();if(!username)return;try{const{data,error}=await supabase.from('users').select('username').eq('username',username);if(error){console.error('查询用户名时出错:',error);return}
if(data&&data.length>0){usernameInput.style.borderColor='#e74c3c';usernameInput.style.boxShadow='0 0 10px rgba(231, 76, 60, 0.3)';const existingHint=document.getElementById('registerUsernameExistsHint');if(existingHint){existingHint.remove()}
const hint=document.createElement('div');hint.id='registerUsernameExistsHint';hint.style.color='#e74c3c';hint.style.fontSize='0.9rem';hint.style.marginTop='5px';hint.innerHTML='<i class="fas fa-exclamation-circle"></i> 用户名已存在';if(usernameInput.parentNode){usernameInput.parentNode.appendChild(hint)}}else{usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';const existingHint=document.getElementById('registerUsernameExistsHint');if(existingHint){existingHint.remove()}}}catch(error){console.error('检查用户名失败:',error);usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';const existingHint=document.getElementById('registerUsernameExistsHint');if(existingHint){existingHint.remove()}}}
async function checkRegisterEmail(){const emailInput=document.getElementById('registerEmail');const email=emailInput.value.trim();if(!email)return;try{const{data,error}=await supabase.from('users').select('email').eq('email',email);if(error){console.error('查询邮箱时出错:',error);return}
if(data&&data.length>0){emailInput.style.borderColor='#e74c3c';emailInput.style.boxShadow='0 0 10px rgba(231, 76, 60, 0.3)';const existingHint=document.getElementById('registerEmailExistsHint');if(existingHint){existingHint.remove()}
const hint=document.createElement('div');hint.id='registerEmailExistsHint';hint.style.color='#e74c3c';hint.style.fontSize='0.9rem';hint.style.marginTop='5px';hint.innerHTML='<i class="fas fa-exclamation-circle"></i> 邮箱已被注册';if(emailInput.parentNode){emailInput.parentNode.appendChild(hint)}}else{emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const existingHint=document.getElementById('registerEmailExistsHint');if(existingHint){existingHint.remove()}}}catch(error){console.error('检查邮箱失败:',error);emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const existingHint=document.getElementById('registerEmailExistsHint');if(existingHint){existingHint.remove()}}}
async function handleLogin(){const username=document.getElementById('loginUsername').value;const password=document.getElementById('loginPassword').value;if(!username||!password){showMessage('请输入用户名和密码','error');return}
try{const{data,error}=await supabase.rpc('login_user',{p_username:username,p_password:password});if(error){console.error('登录函数调用失败:',error);showMessage('登录失败，请稍后重试','error');return}
let result;try{result=typeof data==='string'?JSON.parse(data):data}catch(e){console.error('解析返回数据失败:',e,data);showMessage('登录失败，服务器返回数据格式错误','error');return}
if(!result.success){showMessage(result.message,'error');return}
const{token,user}=result;localStorage.setItem('currentUserId',user.id.toString());localStorage.setItem('currentUserToken',token);gameData.currentUser={...user,warehouse:user.warehouse||{},boxesOpened:user.boxes_opened||0};startRealTimeTokenChecker(gameData.currentUser);updateUserUI();loginModal.classList.remove('active');clearLoginForm();startTokenChecker();setupRealtimeSubscriptions();if(user.role==='admin'){showPage('home');showMessage(`GM ${user.username} 欢迎回来！`,'success')}else if(user.role==='subadmin'){showPage('home');showMessage(`管理员 ${user.username} 欢迎回来！`,'success')}else{showPage('home');showMessage(`欢迎回来，${user.username}！祝您财源滚滚！`,'success')}
startHeartbeat();updateOnlineUsersList();playBgMusic();populateUserWarehouseSelect();unreadChatCount=0;updateChatUnreadBadge()}catch(error){console.error('登录失败:',error);showMessage('登录失败，请稍后重试','error')}}
async function handleLogout(){unreadChatCount=0;updateChatUnreadBadge();if(gameData.currentUser){try{const userId=parseInt(gameData.currentUser.id,10);if(!isNaN(userId)){const{data,error}=await supabase.rpc('logout_user',{p_user_id:userId});if(error){console.error('后端注销失败:',error)}else{console.log('后端注销成功')}}}catch(error){console.error('后端注销异常:',error)}}
if(tokenRealtimeSubscription){supabase.removeChannel(tokenRealtimeSubscription);tokenRealtimeSubscription=null}
if(tokenCheckInterval){clearInterval(tokenCheckInterval);tokenCheckInterval=null}
cleanupRealtimeSubscriptions();if(gameData.currentUser){try{await supabase.from('users').update({last_active:new Date(Date.now()-180000).toISOString()}).eq('id',gameData.currentUser.id)}catch(e){}}
stopHeartbeat();if(chatSubscription){supabase.removeChannel(chatSubscription);chatSubscription=null}
localStorage.clear();sessionStorage.clear();gameData.currentUser=null;isBoxOpening=!1;resultModalAutoCloseTimer=null;redeemType='';selectedItemsForRedeem=[];adminPanelExpanded=!1;currentEditingBoxId=null;coinOperationsCurrentPage=1;coinOperationsFilteredData=[];currentPage='home';closeResultModalFunc();closeAdminPanel();if(document.getElementById('loginUsername'))document.getElementById('loginUsername').value='';if(document.getElementById('loginPassword'))document.getElementById('loginPassword').value='';if(document.getElementById('registerUsername'))document.getElementById('registerUsername').value='';if(document.getElementById('registerPassword'))document.getElementById('registerPassword').value='';if(document.getElementById('registerPasswordConfirm'))document.getElementById('registerPasswordConfirm').value='';if(document.getElementById('registerEmail'))document.getElementById('registerEmail').value='';const allCoins=document.querySelectorAll('.coin');allCoins.forEach(coin=>coin.remove());const allConfetti=document.querySelectorAll('.confetti');allConfetti.forEach(confetti=>confetti.remove());const allSparkles=document.querySelectorAll('.gold-sparkle');allSparkles.forEach(sparkle=>sparkle.remove());const videoOverlays=document.querySelectorAll('.video-prize-overlay');videoOverlays.forEach(overlay=>overlay.remove());if(warehouseItemsList)warehouseItemsList.innerHTML='';if(historyTableBody)historyTableBody.innerHTML='';if(globalHistoryTableBody)globalHistoryTableBody.innerHTML='';if(coinOperationsTableBody)coinOperationsTableBody.innerHTML='';if(blindBoxesGrid)blindBoxesGrid.innerHTML='';updateUserUI();showPage('home');loginModal.classList.remove('active');registerModal.classList.remove('active');userModal.classList.remove('active');itemModal.classList.remove('active');modifyCoinsModal.classList.remove('active');resultModal.classList.remove('active');redeemConfirmModal.classList.remove('active');editBoxItemModal.classList.remove('active');showMessage('已成功退出，所有数据已清空','success');setTimeout(()=>{createCoinRain();updateRoundStats();loginModalBtn.style.display='inline-flex';registerModalBtn.style.display='inline-flex';stopBgMusic();console.log('用户退出完成，所有数据已清空')},100)}
function updateUserUI(){if(gameData.currentUser){userName.textContent=gameData.currentUser.username;userAvatar.textContent=gameData.currentUser.username.charAt(0).toUpperCase();profileName.textContent=gameData.currentUser.username;profileEmail.textContent=gameData.currentUser.email;profileAvatar.textContent=gameData.currentUser.username.charAt(0).toUpperCase();if(gameData.currentUser.is_active===!1){const disabledBadge=document.createElement('span');disabledBadge.className='user-disabled-badge';disabledBadge.textContent='已禁用';disabledBadge.style.background='#e74c3c';disabledBadge.style.color='white';disabledBadge.style.padding='2px 8px';disabledBadge.style.borderRadius='10px';disabledBadge.style.fontSize='0.8rem';disabledBadge.style.marginLeft='5px';userName.appendChild(disabledBadge.cloneNode(!0));profileName.appendChild(disabledBadge.cloneNode(!0));showMessage('您的账户已被管理员禁用，请联系管理员','warning')}
if(gameData.currentUser.role==='admin'){adminBadge.style.display='block';subadminBadge.style.display='none';adminLink.style.display='block';adminMenuItem.style.display='block';profileRole.textContent='GM';profileApprovalStatus.style.display='none';document.getElementById('user-stats-section').style.display='none';userBalance.textContent='--';userBoxesOpened.textContent='--';userWarehouse.textContent='--';userLevel.textContent='--';const warehouseNavLink=document.querySelector('.nav-link[data-page="warehouse"]');const warehouseMenuItem=document.querySelector('.sidebar-menu-item[data-page="warehouse"]');if(warehouseNavLink)warehouseNavLink.style.display='none';if(warehouseMenuItem)warehouseMenuItem.style.display='none'}else if(gameData.currentUser.role==='subadmin'){adminBadge.style.display='none';subadminBadge.style.display='block';adminLink.style.display='block';adminMenuItem.style.display='block';profileRole.textContent='管理员';profileApprovalStatus.style.display='none';document.getElementById('user-stats-section').style.display='none';userBalance.textContent='--';userBoxesOpened.textContent='--';userWarehouse.textContent='--';userLevel.textContent='--';const warehouseNavLink=document.querySelector('.nav-link[data-page="warehouse"]');const warehouseMenuItem=document.querySelector('.sidebar-menu-item[data-page="warehouse"]');if(warehouseNavLink)warehouseNavLink.style.display='none';if(warehouseMenuItem)warehouseMenuItem.style.display='none'}else{adminBadge.style.display='none';subadminBadge.style.display='none';adminLink.style.display='none';adminMenuItem.style.display='none';profileRole.textContent='普通用户';if(!gameData.currentUser.approved){profileApprovalStatus.textContent='待审批';profileApprovalStatus.className='approval-pending';profileApprovalStatus.style.display='block'}else{profileApprovalStatus.style.display='none'}
document.getElementById('user-stats-section').style.display='block';const user=gameData.currentUser;userBalance.textContent=user.balance;if(document.getElementById('userGiftBalance')){document.getElementById('userGiftBalance').textContent=user.gift_balance||0}
userBoxesOpened.textContent=user.boxesOpened||0;const myHistory=(gameData.userHistory||[]).filter(r=>r.user_id===gameData.currentUser.id);const totalItemsFromHistory=myHistory.length;userWarehouse.textContent=totalItemsFromHistory;userLevel.textContent=gameData.currentUser.level;const warehouseNavLink=document.querySelector('.nav-link[data-page="warehouse"]');const warehouseMenuItem=document.querySelector('.sidebar-menu-item[data-page="warehouse"]');if(warehouseNavLink)warehouseNavLink.style.display='block';if(warehouseMenuItem)warehouseMenuItem.style.display='block'}
userLoggedOut.style.display='none';userLoggedIn.style.display='flex'}else{userLoggedOut.style.display='block';userLoggedIn.style.display='none';const warehouseNavLink=document.querySelector('.nav-link[data-page="warehouse"]');const warehouseMenuItem=document.querySelector('.sidebar-menu-item[data-page="warehouse"]');if(warehouseNavLink)warehouseNavLink.style.display='none';if(warehouseMenuItem)warehouseMenuItem.style.display='none'}}
function showMessage(text,type='info'){const existingMessage=document.querySelector('.message');if(existingMessage){existingMessage.remove()}
const message=document.createElement('div');message.className=`message message-${type}`;message.innerHTML=`
        <span>${text}</span>
        <button class="close-message">&times;</button>
    `;const mainContainer=document.querySelector('.main-container');if(mainContainer){mainContainer.prepend(message)}else{document.body.prepend(message)}
message.querySelector('.close-message').addEventListener('click',()=>{message.remove()});setTimeout(()=>{if(message.parentNode){message.remove()}},5000)}
function clearLoginForm(){document.getElementById('loginUsername').value='';document.getElementById('loginPassword').value=''}
function clearRegisterForm(){document.getElementById('registerUsername').value='';document.getElementById('registerPassword').value='';document.getElementById('registerPasswordConfirm').value='';document.getElementById('registerEmail').value='';const usernameInput=document.getElementById('registerUsername');const emailInput=document.getElementById('registerEmail');usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const usernameHint=document.getElementById('registerUsernameExistsHint');const emailHint=document.getElementById('registerEmailExistsHint');if(usernameHint)usernameHint.remove();if(emailHint)emailHint.remove();}
function clearUserForm(){document.getElementById('newUsername').value='';document.getElementById('newPassword').value='';document.getElementById('newPasswordConfirm').value='';document.getElementById('newEmail').value='';document.getElementById('newBalance').value=gameData.systemSettings.default_user_balance||0;document.getElementById('newRole').value='user';const usernameInput=document.getElementById('newUsername');const emailInput=document.getElementById('newEmail');usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const usernameHint=document.getElementById('usernameExistsHint');const emailHint=document.getElementById('emailExistsHint');if(usernameHint)usernameHint.remove();if(emailHint)emailHint.remove();}
function clearItemForm(){document.getElementById('itemName').value='';document.getElementById('itemIcon').value='';document.getElementById('itemValue').value='10';document.getElementById('itemRarity').value='common';document.getElementById('itemChance').value='1';document.getElementById('itemTotalLimit').value='10';document.getElementById('itemDescription').value='';const nameInput=document.getElementById('itemName');nameInput.style.borderColor='rgba(255, 215, 0, 0.3)';nameInput.style.boxShadow='none';const existingHint=document.getElementById('nameExistsHint');if(existingHint){existingHint.remove()}
removeCover();videoCoverUpload.style.display='none'}
function populateProfileForm(){if(!gameData.currentUser)return;document.getElementById('profileUsername').value=gameData.currentUser.username;document.getElementById('profileEmailInput').value=gameData.currentUser.email;document.getElementById('profilePassword').value='';document.getElementById('profilePasswordConfirm').value=''}
async function updateProfile(){if(!gameData.currentUser)return;const email=document.getElementById('profileEmailInput').value;const password=document.getElementById('profilePassword').value;const passwordConfirm=document.getElementById('profilePasswordConfirm').value;if(!email){showMessage('请输入电子邮箱','error');return}
if(password&&password!==passwordConfirm){showMessage('两次输入的密码不一致','error');return}
try{const{data,error}=await supabase.rpc('update_user_profile',{p_user_id:gameData.currentUser.id,p_email:email,p_password:password||null});if(error)throw error;if(!data.success){showMessage(data.message,'error');return}
gameData.currentUser.email=email;if(password){gameData.currentUser.password=password}
updateUserUI();showMessage('个人资料已更新','success')}catch(error){console.error('更新个人资料失败:',error);showMessage('更新个人资料失败，请稍后重试','error')}}
function renderChatMessages(){const container=document.getElementById('chatMessagesList');if(!container)return;const messages=gameData.chatMessages||[];if(messages.length===0){container.innerHTML=`<div style="text-align: center; color: rgba(255,215,0,0.6); padding: 40px;">
            <i class="fas fa-comment-dots" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>暂无聊天消息，发送第一条吧~</p>
        </div>`;return}
let html='';messages.forEach(msg=>{const isSelf=gameData.currentUser&&msg.user_id===gameData.currentUser.id;const time=msg.created_at?formatDateTime(msg.created_at):'';const avatarChar=msg.username?msg.username.charAt(0).toUpperCase():'?';html+=`
            <div class="chat-message ${isSelf ? 'chat-message-self' : ''}">
                <div class="chat-avatar">${avatarChar}</div>
                <div class="chat-content">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap;">
                        <span class="chat-username">${msg.username || '未知'}</span>
                        <span class="chat-time">${time}</span>
                    </div>
                    <div class="chat-text">${escapeHtml(msg.message)}</div>
                </div>
            </div>
        `});container.innerHTML=html;container.scrollTop=container.scrollHeight}
async function refreshChatMessages(){try{const{data,error}=await supabase.from('chat_messages').select('*').order('created_at',{ascending:!1}).limit(50);if(error){console.error('加载聊天消息失败:',error);gameData.chatMessages=[]}else{gameData.chatMessages=data?data.reverse():[]}}catch(e){console.error('刷新聊天消息异常:',e);gameData.chatMessages=[]}}
function renderOnlineUsers(){const listEl=document.getElementById('onlineUsersList');const countEl=document.getElementById('onlineCount');const noUsersEl=document.getElementById('noOnlineUsers');if(!listEl)return;const users=gameData.onlineUsers||[];if(countEl)countEl.textContent=users.length;if(users.length===0){listEl.innerHTML='';if(noUsersEl)noUsersEl.style.display='block';return}
if(noUsersEl)noUsersEl.style.display='none';let html='';users.forEach(user=>{html+=`
            <div class="online-user-item">
                <span class="online-status-dot"></span>
                <div style="flex:1;">
                    <div style="color: gold; font-weight: 600;">${user.username}</div>
                    <div style="font-size: 0.7rem; color: rgba(255,215,0,0.6);">在线</div>
                </div>
            </div>
        `});listEl.innerHTML=html}
function escapeHtml(unsafe){if(!unsafe)return'';return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
async function sendChatMessage(){const input=document.getElementById('chatMessageInput');const msg=input.value.trim();if(!msg)return;if(!gameData.currentUser){showMessage('请先登录','error');return}
try{const{error}=await supabase.from('chat_messages').insert([{user_id:gameData.currentUser.id,username:gameData.currentUser.username,message:msg}]);if(error)throw error;input.value=''}catch(e){console.error('发送失败:',e);showMessage('发送失败，请稍后重试','error')}}
function renderTreasureBoxes(){if(!gameData.currentUser||!blindBoxesGrid)return;if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin();return}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin();return}
const boxes=gameData.globalRound.boxes||[];blindBoxesGrid.innerHTML='';boxes.forEach((box,index)=>{const boxElement=document.createElement('div');const isOpenedByCurrentUser=box.isOpened&&box.openedBy===gameData.currentUser.id;const isOpenedByOthers=box.isOpened&&box.openedBy!==gameData.currentUser.id;if(isOpenedByCurrentUser){boxElement.className='treasure-box opened'}else if(isOpenedByOthers){boxElement.className='treasure-box opened';boxElement.style.opacity='0.6'}else{boxElement.className='treasure-box';const random=Math.random();if(random<0.02){boxElement.classList.add('legendary-unopened')}else if(random<0.05){boxElement.classList.add('epic-unopened')}else if(random<0.15){boxElement.classList.add('rare-unopened')}}
boxElement.dataset.boxId=box.id;let boxLabel='';let boxSubtitle='';if(isOpenedByCurrentUser){boxLabel='✓';boxSubtitle=''}else if(isOpenedByOthers){boxLabel='🔒';boxSubtitle=''}else{boxLabel='';boxSubtitle='点击开启'}
let openerInfoHtml='';if(box.isOpened){const openerName=getUsernameById(box.openedBy);openerInfoHtml=`<div class="box-opener-info">开启者: ${escapeHtml(openerName)}</div>`}
boxElement.innerHTML=`
            <div class="box-glow"></div>
            <div class="box-decoration">
                <div class="box-corner corner-tl"></div>
                <div class="box-corner corner-tr"></div>
                <div class="box-corner corner-bl"></div>
                <div class="box-corner corner-br"></div>
            </div>
            <div class="treasure-box-lid"></div>
            <div class="treasure-box-body"></div>
            <div class="box-content">
                <div class="box-label">${boxLabel}</div>
                <div class="box-subtitle">${boxSubtitle}</div>
            </div>
            <div class="box-number">${box.id}</div>
            ${openerInfoHtml}
        `;if(!box.isOpened&&gameData.currentUser.role==='user'&&gameData.currentUser.approved){boxElement.addEventListener('click',()=>{if(isBoxOpening){showMessage('请等待当前开盒结果确认后再开启其他宝盒','warning');return}
openBox(box.id)})}
blindBoxesGrid.appendChild(boxElement)})}
function updateRoundStats(){if(!gameData.currentUser)return;const globalBoxes=gameData.globalRound.boxes;const openedCount=globalBoxes.filter(box=>box.isOpened).length;const remainingCount=50-openedCount;const progress=(openedCount/50*100).toFixed(0);openedBoxesCount.textContent=openedCount;remainingBoxesCount.textContent=remainingCount;roundProgress.textContent=`${progress}%`}
async function openBox(boxId){console.log('【调试】当前开盒模式:',currentBoxMode);const costMap={1:20000,2:100000,3:200000};const requiredCoins=costMap[currentBoxMode];if(gameData.currentUser.balance<requiredCoins){showMessage(`金币不足，${currentBoxMode === 1 ? '普通' : currentBoxMode === 2 ? '高级' : '豪华'}模式需要 ${requiredCoins} 金币`,'error');isBoxOpening=!1;enableAllBoxes();return}
const boxElement=document.querySelector(`.treasure-box[data-box-id="${boxId}"]`);if(boxElement){boxElement.classList.add('box-shake');setTimeout(()=>{boxElement.classList.remove('box-shake')},1000)}
if(window.navigator&&typeof window.navigator.vibrate==='function'){try{window.navigator.vibrate(1000)}catch(e){console.warn('❌ 物理震动调用失败:',e)}}else{}
if(!gameData.currentUser){showMessage('请先登录','error');loginModal.classList.add('active');return}
if(gameData.currentUser.is_active===!1){showMessage('您的账户已被管理员禁用，无法开启宝盒','error');return}
if(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'){showMessage('管理员不能开启宝盒，请使用普通用户账号参与游戏。','error');return}
if(isBoxOpening){showMessage('请等待当前开盒结果确认后再开启其他宝盒','warning');return}
if(!boxElement)return;isBoxOpening=!0;const allBoxes=document.querySelectorAll('.treasure-box');allBoxes.forEach(box=>{if(!box.classList.contains('opened')){box.style.cursor='not-allowed';box.style.opacity='0.6'}});try{const{data:result,error:rpcError}=await supabase.rpc('open_box_function',{p_user_id:gameData.currentUser.id,p_box_id:boxId,p_mode:currentBoxMode});if(rpcError){console.error('RPC调用失败:',rpcError);showMessage('开盒失败：'+(rpcError.message||'未知错误'),'error');isBoxOpening=!1;enableAllBoxes();return}
if(!result||!result.success){showMessage(result?.message||'开盒失败','error');isBoxOpening=!1;enableAllBoxes();return}
const itemData=result.data.item;if(itemData.id!==0){const fullItemData=gameData.items.find(item=>item.id===itemData.id);if(fullItemData){Object.assign(itemData,{name:fullItemData.name,icon:fullItemData.icon||itemData.icon,value:fullItemData.value||itemData.value,rarity:fullItemData.rarity||itemData.rarity,description:fullItemData.description||itemData.description,media_url:fullItemData.media_url,cover_url:fullItemData.cover_url});if(itemData.rarity==='epic'||itemData.rarity==='legendary'){sendSystemChatMessage(itemData,gameData.currentUser.username).catch(console.error)}}}
if(result&&result.success){const rewardAmount=result.data.rewardAmount!==undefined?result.data.rewardAmount:0;const quantity=result.data.quantity!==undefined?result.data.quantity:1;let multiplier=result.data.multiplier!==undefined?result.data.multiplier:1;let itemData=result.data.item||{id:0};if(itemData.id!==0){const fullItemData=gameData.items.find(item=>item.id===itemData.id);if(fullItemData){Object.assign(itemData,{name:fullItemData.name,icon:fullItemData.icon||itemData.icon,value:fullItemData.value||itemData.value,rarity:fullItemData.rarity||itemData.rarity,description:fullItemData.description||itemData.description,media_url:fullItemData.media_url,cover_url:fullItemData.cover_url})}
if(multiplier===undefined){multiplier=itemData.multiplier||1}}
gameData.currentUser.balance=result.data.balance;gameData.currentUser.boxesOpened=result.data.boxesOpened;gameData.currentUser.level=result.data.level;const boxIndex=gameData.globalRound.boxes.findIndex(b=>b.id===boxId);if(boxIndex!==-1){gameData.globalRound.boxes[boxIndex]={...gameData.globalRound.boxes[boxIndex],isOpened:!0,openedBy:gameData.currentUser.id,itemId:itemData.id,openedAt:new Date().toISOString()}}
const allOpened=gameData.globalRound.boxes.every(b=>b.isOpened);if(allOpened&&!window._isLoadingNewRound){window._isLoadingNewRound=!0;setTimeout(async()=>{try{const{data:latestRound,error}=await supabase.from('global_rounds').select('*').order('round_id',{ascending:!1}).limit(1).single();if(error)throw error;if(latestRound.round_id>gameData.globalRound.round_id){gameData.globalRound={id:latestRound.id,round_id:latestRound.round_id,boxes:latestRound.boxes||[],started_at:latestRound.started_at,completed_at:latestRound.completed_at,preset_generated:latestRound.preset_generated||!1};window._lastProcessedRoundId=gameData.globalRound.round_id;if(document.getElementById('home-section')?.classList.contains('active')){if(gameData.currentUser.role==='admin')renderTreasureBoxesForAdmin();else if(gameData.currentUser.role==='subadmin')renderTreasureBoxesForSubadmin();else renderTreasureBoxes();updateRoundStats()}
if(gameData.currentUser&&(gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'))updateAdminHomeStats();showMessage('✨ 新的一轮盲盒已开启！','success')}}catch(e){console.error('主动加载新轮次失败:',e);showMessage('新轮次加载失败，请刷新页面','warning')}finally{window._isLoadingNewRound=!1}},300)}
playOpenBoxAnimation(boxElement,itemData,()=>{setTimeout(()=>{updateUserUI();renderTreasureBoxes();updateRoundStats();showOpenBoxResult(itemData,rewardAmount,quantity,multiplier,boxId);updateWarehouseDisplay();updateHistoryDisplay();updateGlobalHistoryDisplay();updateAdminHomeStats();isBoxOpening=!1;enableAllBoxes()},100)})}else{playOpenBoxAnimation(boxElement,itemData,()=>{setTimeout(()=>{updateUserUI();renderTreasureBoxes();updateRoundStats();showOpenBoxResult(itemData,rewardAmount,quantity,multiplier,boxId);updateWarehouseDisplay();updateHistoryDisplay();updateGlobalHistoryDisplay();updateAdminHomeStats();isBoxOpening=!1;enableAllBoxes()},100)})}}catch(error){console.error('Error opening box:',error);showMessage('开盒失败，请稍后重试','error');isBoxOpening=!1;enableAllBoxes()}}
function showOpenBoxResult(item,rewardAmount,quantity,multiplier,boxId){const isEmpty=item.id===0;const rarityColor=isEmpty?'#a8a8a8':getRarityColor(item.rarity);const rarityText=isEmpty?'空盒':getRarityText(item.rarity);let mediaHtml='';if(!isEmpty){if(item.cover_url){mediaHtml=`<img src="${item.cover_url}" style="max-width: 200px; max-height: 200px; border-radius: 15px; border: 3px solid ${rarityColor};">`}else if(item.media_url&&/\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url)){mediaHtml=`<img src="${item.media_url}" style="max-width: 200px; max-height: 200px; border-radius: 15px; border: 3px solid ${rarityColor};">`}else{mediaHtml=`<div style="font-size: 4rem;">${item.icon || (isEmpty ? '📦' : '🎁')}</div>`}}else{mediaHtml=`<div style="font-size: 4rem;">📦</div>`}
const modalContent=`
        <div class="result-modal-item" style="text-align: center;">
            ${mediaHtml}
            <div class="result-modal-name" style="font-size: 1.8rem; margin: 15px 0;">${isEmpty ? '空盒' : item.name}</div>
            <div class="item-rarity rarity-${isEmpty ? 'common' : item.rarity}" style="display: inline-block; margin-bottom: 15px;">${rarityText}</div>
            ${!isEmpty && quantity > 1 ? `<div style="font-size: 1.2rem; color: #FFD700;">获得数量:${quantity}个</div>` : ''}
            ${!isEmpty ? `<div style="font-size: 1.2rem; color: #FFD700;">单件价值:${item.value}金币 ${multiplier>1?`× ${multiplier} 倍`:''}</div><div style="font-size: 1.8rem; font-weight: bold; color: #FFD700; margin: 20px 0;">获得金币:+${rewardAmount}金币</div>` : `<div style="font-size: 1.5rem; color: #aaa; margin: 20px 0;">很遗憾，这是个空盒！</div>`}
            <div style="color: rgba(255,215,0,0.8);">来自宝盒 #${boxId}</div>
        </div>
    `;resultModalContent.innerHTML=modalContent;resultModal.classList.add('active');startAutoCloseCountdown();if(!isEmpty){showMessage(`获得 ${rewardAmount} 金币！`,'success')}else{showMessage(`宝盒 #${boxId} 是空盒`,'warning')}}
function showItemRewardModal(item,quantity,totalValue,multiplier,boxId){const rarityColor=getRarityColor(item.rarity);const rarityText=getRarityText(item.rarity);let mediaHtml='';if(item.cover_url){mediaHtml=`<img src="${item.cover_url}" style="max-width: 200px; max-height: 200px; border-radius: 15px; border: 3px solid ${rarityColor};">`}else if(item.media_url&&/\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url)){mediaHtml=`<img src="${item.media_url}" style="max-width: 200px; max-height: 200px; border-radius: 15px; border: 3px solid ${rarityColor};">`}else{mediaHtml=`<div style="font-size: 4rem;">${item.icon || '🎁'}</div>`}
const quantityDisplay=quantity>1?`× ${quantity}`:'';const multiplierText=multiplier>1?`(${multiplier}倍)`:'';const modalContent=`
        <div class="result-modal-item" style="text-align: center;">
            ${mediaHtml}
            <div class="result-modal-name" style="font-size: 1.8rem; margin: 15px 0;">${item.name} ${quantityDisplay}</div>
            <div class="item-rarity rarity-${item.rarity}" style="display: inline-block; margin-bottom: 15px;">${rarityText}</div>
            <div style="font-size: 1.2rem; color: #FFD700;">
                单件价值: ${item.value} 金币 ${multiplierText}
            </div>
            <div style="font-size: 2rem; font-weight: bold; color: #FFD700; margin: 20px 0;">
                总价值: + ${totalValue} 金币
            </div>
            <div style="color: rgba(255,215,0,0.8);">来自宝盒 #${boxId}</div>
        </div>
    `;resultModalContent.innerHTML=modalContent;resultModal.classList.add('active');startAutoCloseCountdown();showMessage(`获得 ${item.name} ${quantityDisplay}，总价值 ${totalValue} 金币！`,'success')}
async function sendSystemChatMessage(item,username){const message=`恭喜 ${username} 开出了 ${item.name}（${getRarityText(item.rarity)}物品，价值 ${item.value} 金币）！`;try{const{error}=await supabase.from('chat_messages').insert([{user_id:0,username:'系统',message:message}]);if(error)throw error;console.log('系统消息已发送:',message)}catch(e){console.error('发送系统聊天消息失败',e)}}
function playOpenBoxAnimation(boxElement,item,callback){boxElement.classList.add('opened');if(item.id===0){callback&&callback();return}
const rarity=item.rarity;const glow=document.createElement('div');glow.className=`rarity-glow glow-${rarity}`;boxElement.appendChild(glow);setTimeout(()=>{glow.style.opacity='1';glow.style.transition='opacity 0.3s ease-out'},10);setTimeout(()=>{glow.style.opacity='0';setTimeout(()=>{if(glow.parentNode){glow.remove()}},300)},1000);const isVideoItem=item.media_url&&item.media_url.match(/\.(mp4|webm|ogg|mov)$/i);if(isVideoItem){playVideoPrize(item,()=>{continueAnimation()})}else{continueAnimation()}
function continueAnimation(){if(rarity==='epic'||rarity==='legendary'){const jackpotText=document.createElement('div');jackpotText.className='jackpot-effect';jackpotText.innerHTML=`<div class="jackpot-text">${getRarityText(rarity)}!</div>`;document.body.appendChild(jackpotText);setTimeout(()=>{jackpotText.style.opacity='1';jackpotText.style.transition='opacity 0.5s ease-out'},50);setTimeout(()=>{jackpotText.style.opacity='0';setTimeout(()=>{if(jackpotText.parentNode){jackpotText.remove()}},500)},2000);createConfetti(rarity);createGoldSparkles(boxElement)}
setTimeout(()=>{callback&&callback()},isVideoItem?500:1000)}}
function playVideoPrize(item,callback){let wasMusicPlaying=!1;if(bgMusic&&isMusicPlaying){wasMusicPlaying=!0;pauseBgMusic()}
const videoOverlay=document.createElement('div');videoOverlay.className='video-prize-overlay';videoOverlay.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease-in;
    `;const videoContainer=document.createElement('div');videoContainer.style.cssText=`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
    `;const videoElement=document.createElement('video');videoElement.src=item.media_url;videoElement.autoplay=!0;videoElement.playsInline=!0;videoElement.webkitPlaysInline=!0;videoElement.muted=!0;videoElement.style.cssText=`
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
    `;videoContainer.appendChild(videoElement);videoOverlay.appendChild(videoContainer);document.body.appendChild(videoOverlay);setTimeout(()=>{videoOverlay.style.opacity='1';const playPromise=videoElement.play();if(playPromise!==undefined){playPromise.then(()=>{setTimeout(()=>{videoElement.muted=!1},300)}).catch(error=>{videoElement.muted=!0;videoElement.play().then(()=>{}).catch(e=>{closeVideoOverlay()})})}},100);videoElement.addEventListener('ended',()=>{closeVideoOverlay()});videoElement.addEventListener('error',(e)=>{console.error('视频播放错误:',e);closeVideoOverlay()});videoElement.addEventListener('loadedmetadata',()=>{});videoElement.addEventListener('play',()=>{});function closeVideoOverlay(){videoOverlay.style.opacity='0';setTimeout(()=>{if(videoOverlay.parentNode){videoOverlay.remove()}
if(wasMusicPlaying){playBgMusic()}
callback&&callback()},500)}
const safetyTimeout=setTimeout(()=>{if(videoOverlay.parentNode){closeVideoOverlay()}},60000);videoElement.addEventListener('ended',()=>{clearTimeout(safetyTimeout)})}
function createConfetti(rarity){const colors={'epic':['#9C27B0','#FF1493','#FF6347'],'legendary':['#FFD700','#FF8C00','#FF4500']};const confettiColors=colors[rarity]||['#FFD700','#FFA500','#FF8C00'];const confettiCount=rarity==='legendary'?100:50;for(let i=0;i<confettiCount;i++){setTimeout(()=>{const confetti=document.createElement('div');confetti.className='confetti';confetti.style.backgroundColor=confettiColors[Math.floor(Math.random()*confettiColors.length)];confetti.style.left=Math.random()*100+'vw';confetti.style.width=(Math.random()*10+5)+'px';confetti.style.height=(Math.random()*10+5)+'px';confetti.style.animation=`confettiFall ${(Math.random() * 3 + 2)}s linear forwards`;document.body.appendChild(confetti);setTimeout(()=>{if(confetti.parentNode){confetti.remove()}},5000)},i*20)}}
function createGoldSparkles(boxElement){const rect=boxElement.getBoundingClientRect();const centerX=rect.left+rect.width/2;const centerY=rect.top+rect.height/2;for(let i=0;i<20;i++){setTimeout(()=>{const sparkle=document.createElement('div');sparkle.className='gold-sparkle';const angle=Math.random()*Math.PI*2;const distance=Math.random()*100+50;const x=centerX+Math.cos(angle)*distance;const y=centerY+Math.sin(angle)*distance;sparkle.style.left=x+'px';sparkle.style.top=y+'px';sparkle.style.animation=`sparkle ${Math.random() * 0.5 + 0.5}s ease-in-out`;document.body.appendChild(sparkle);setTimeout(()=>{if(sparkle.parentNode){sparkle.remove()}},1000)},i*50)}}
function showResultModal(item,boxId){const rarityText=getRarityText(item.rarity);const rarityColor=getRarityColor(item.rarity);let descriptionHTML='';if(item.id!==0&&item.description&&item.description.trim()!==''){descriptionHTML=`<div class="item-description">${escapeHtml(item.description)}</div>`}
let itemContent='';if(item.cover_url){itemContent=`
            <div class="result-modal-media" style="width: 100%; max-width: 500px; margin: 0 auto 25px;">
                <img src="${item.cover_url}" alt="${item.name}" 
                     style="width: 100%; height: auto; max-height: 350px; border-radius: 15px; border: 4px solid ${rarityColor}; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            </div>
            <div class="result-modal-info" style="width: 100%; text-align: center;">
                <div class="result-modal-name" style="font-size: 2.2rem; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(255,215,0,0.5);">${item.name}</div>
                <div class="result-modal-value" style="font-size: 1.8rem; margin-bottom: 20px; color: #FFD700; font-weight: bold;">价值 ${item.value} 金币</div>
                <div class="item-rarity rarity-${item.rarity}" style="display: inline-block; margin-bottom: 20px; padding: 8px 25px; font-size: 1.2rem; border-width: 2px;">${rarityText} 物品</div>
                ${descriptionHTML}
            </div>
        `}else if(item.media_url&&item.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)){itemContent=`
            <div class="result-modal-media" style="width: 100%; max-width: 500px; margin: 0 auto 25px;">
                <img src="${item.media_url}" alt="${item.name}" 
                     style="width: 100%; height: auto; max-height: 350px; border-radius: 15px; border: 4px solid ${rarityColor}; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            </div>
            <div class="result-modal-info" style="width: 100%; text-align: center;">
                <div class="result-modal-name" style="font-size: 2.2rem; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(255,215,0,0.5);">${item.name}</div>
                <div class="result-modal-value" style="font-size: 1.8rem; margin-bottom: 20px; color: #FFD700; font-weight: bold;">价值 ${item.value} 金币</div>
                <div class="item-rarity rarity-${item.rarity}" style="display: inline-block; margin-bottom: 20px; padding: 8px 25px; font-size: 1.2rem; border-width: 2px;">${rarityText} 物品</div>
                ${descriptionHTML}
            </div>
        `}else if(item.media_url&&item.media_url.match(/\.(mp4|webm|ogg)$/i)){itemContent=`
            <div class="result-modal-icon" style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: ${rarityColor}20; border: 4px solid ${rarityColor}; border-radius: 25px; margin: 0 auto 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                ${item.icon || '🎥'}
            </div>
            <div class="result-modal-info" style="width: 100%; text-align: center;">
                <div class="result-modal-name" style="font-size: 2.2rem; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(255,215,0,0.5);">${item.name}</div>
                <div class="result-modal-value" style="font-size: 1.8rem; margin-bottom: 20px; color: #FFD700; font-weight: bold;">价值 ${item.value} 金币</div>
                <div class="item-rarity rarity-${item.rarity}" style="display: inline-block; margin-bottom: 20px; padding: 8px 25px; font-size: 1.2rem; border-width: 2px;">${rarityText} 物品</div>
                ${descriptionHTML}
                <p style="color: rgba(255, 215, 0, 0.7); font-style: italic; margin-top: 10px;">
                    <i class="fas fa-video"></i> 视频物品
                </p>
            </div>
        `}else{itemContent=`
            <div class="result-modal-icon" style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: ${rarityColor}20; border: 4px solid ${rarityColor}; border-radius: 25px; margin: 0 auto 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                ${item.icon || '🎁'}
            </div>
            <div class="result-modal-info" style="width: 100%; text-align: center;">
                <div class="result-modal-name" style="font-size: 2.2rem; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(255,215,0,0.5);">${item.name}</div>
                <div class="result-modal-value" style="font-size: 1.8rem; margin-bottom: 20px; color: #FFD700; font-weight: bold;"> ${item.value} 金币</div>
                <div class="item-rarity rarity-${item.rarity}" style="display: inline-block; margin-bottom: 20px; padding: 8px 25px; font-size: 1.2rem; border-width: 2px;">${rarityText} 物品</div>
                ${descriptionHTML}
            </div>
        `}
resultModalContent.innerHTML=`
        <div class="result-modal-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px;">
            ${itemContent}
        </div>
    `;playBgMusic();resultModal.classList.add('active');if(item.id===0){showMessage(`宝藏盒子 #${boxId} 是空盒，物品已全部抽完`,'warning')}else{showMessage(`恭喜从宝藏盒子 #${boxId} 获得 ${rarityText} 物品：${item.name} (价值 ${item.value} 金币)！`,'success')}
startAutoCloseCountdown()}
function startAutoCloseCountdown(){let secondsLeft=5;if(resultModalAutoCloseTimer){clearInterval(resultModalAutoCloseTimer)}
resultModalAutoclose.textContent=`弹窗将在${secondsLeft}秒后自动关闭`;resultModalAutoCloseTimer=setInterval(()=>{secondsLeft--;resultModalAutoclose.textContent=`弹窗将在${secondsLeft}秒后自动关闭`;if(secondsLeft<=0){closeResultModalFunc()}},1000)}
async function resetGlobalRound(){const newRoundId=gameData.globalRound.round_id+1;const newRound={round_id:newRoundId,boxes:Array(50).fill().map((_,index)=>({id:index+1,isOpened:!1,openedBy:null,itemId:null,presetItemId:null,openedAt:null})),started_at:new Date().toISOString(),completed_at:null,preset_generated:!1};try{const{data:createdRound,error}=await supabase.from('global_rounds').insert([newRound]).select().single();if(error)throw error;gameData.globalRound={id:createdRound.id,round_id:createdRound.round_id,boxes:createdRound.boxes,started_at:createdRound.started_at,completed_at:createdRound.completed_at,preset_generated:createdRound.preset_generated||!1};if(gameData.currentUser){if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin();updateAdminHomeStats()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin();updateAdminHomeStats()}else{renderTreasureBoxes();updateRoundStats()}}
showMessage(`全局宝盒已重置，开始第${newRoundId}轮！`,'success')}catch(error){console.error('Error resetting global round:',error);showMessage('重置失败，请稍后重试','error')}}
function getRarityText(rarity){const rarityMap={'common':'普通','uncommon':'稀有','rare':'珍贵','epic':'史诗','legendary':'传说'};return rarityMap[rarity]||rarity}
function getRarityColor(rarity){const colorMap={'common':'#a8a8a8','uncommon':'#4caf50','rare':'#2196f3','epic':'#9c27b0','legendary':'#ffc107'};return colorMap[rarity]||'#a8a8a8'}
function getUsernameById(userId){const user=gameData.users.find(u=>u.id===userId);return user?user.username:'未知用户'}
function getApprovalStatusText(approved){if(approved===!0)return'已批准';if(approved===!1)return'待审批';return'未知'}
function getApprovalStatusClass(approved){if(approved===!0)return'approval-approved';if(approved===!1)return'approval-pending';return'approval-pending'}
function updateWarehouseDisplay(){if(!gameData.currentUser||gameData.currentUser.role==='admin'||gameData.currentUser.role==='subadmin'){return}
const warehouse=gameData.currentUser.warehouse||{};const totalItems=Object.values(warehouse).reduce((sum,qty)=>sum+qty,0);let totalValue=0;for(const[itemId,qty]of Object.entries(warehouse)){const item=gameData.items.find(i=>i.id===parseInt(itemId));if(item){totalValue+=item.value*qty}}
warehouseCount.textContent=totalItems;warehouseTotalValue.textContent=totalValue;warehouseTotalGold.textContent=totalValue;const container=document.getElementById('warehouseItemsList');if(!container)return;if(totalItems===0){container.innerHTML=`<div style="text-align: center; padding: 50px;">暂无仓库物品</div>`;return}
const itemsList=Object.entries(warehouse).map(([itemId,qty])=>{const item=gameData.items.find(i=>i.id===parseInt(itemId));return item?{item,qty}:null}).filter(v=>v!==null).sort((a,b)=>{const rarityOrder={'legendary':5,'epic':4,'rare':3,'uncommon':2,'common':1};return(rarityOrder[b.item.rarity]||0)-(rarityOrder[a.item.rarity]||0)});container.innerHTML=itemsList.map(({item,qty})=>{const rarityColor=getRarityColor(item.rarity);let mediaHtml='';const displayUrl=item.cover_url||(item.media_url&&/\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url)?item.media_url:null);if(displayUrl){mediaHtml=`<img src="${displayUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid ${rarityColor};">`}else{mediaHtml=`<div style="font-size: 2.5rem;">${item.icon || '🎁'}</div>`}
return `
            <div class="result-item" style="display: flex; align-items: center; gap: 20px; padding: 20px;">
                <div style="min-width: 70px; text-align: center;">
                    ${mediaHtml}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 1.2rem; color: #FFD700;">${item.name}</div>
                    <div style="color: ${rarityColor}; margin: 5px 0;">${getRarityText(item.rarity)} 物品</div>
                    <div>单件价值: ${item.value} 金币</div>
                    ${item.description ? `<div style="margin-top: 8px; color: rgba(255,215,0,0.8);">${item.description}</div>` : ''}
                </div>
                <div style="text-align: center; min-width: 100px;">
                    <div style="font-size: 1.8rem; font-weight: bold; color: #FFD700;">×${qty}</div>
                    <div>总价值: ${item.value * qty} 金币</div>
                </div>
            </div>
        `}).join('')}
function updateSelectedItems(){selectedItemsForRedeem=getSelectedWarehouseItems();if(selectedItemsForRedeem.length>0){redeemSelectedBtn.textContent=`兑换选中物品 (${selectedItemsForRedeem.length}个)`}else{redeemSelectedBtn.textContent='兑换选中物品'}}
function getSelectedWarehouseItems(){const selectedItems=[];document.querySelectorAll('.warehouse-item-checkbox:checked').forEach(checkbox=>{const itemId=parseInt(checkbox.getAttribute('data-item-id'));const item=gameData.items.find(i=>i.id===itemId);if(item){const quantity=(gameData.currentUser.warehouse||{})[itemId]||0;selectedItems.push({id:itemId,name:item.name,value:item.value,quantity:quantity})}});return selectedItems}
function showRedeemConfirmModal(type,itemId=null,quantity=null){if(!redeemConfirmDetails){console.error('兑换确认模态框元素未找到');return}
let details='';let totalGold=0;let itemsToRedeem=[];try{if(type==='all'){const warehouse=gameData.currentUser.warehouse||{};Object.keys(warehouse).forEach(itemId=>{const item=gameData.items.find(i=>i.id===parseInt(itemId));if(item){const itemQuantity=warehouse[itemId];totalGold+=item.value*itemQuantity;itemsToRedeem.push({id:item.id,name:item.name,value:item.value,quantity:itemQuantity})}});details=`
                <p>您确定要兑换仓库中的所有物品吗？</p>
                <p style="font-size: 1.5rem; color: #FFD700; margin: 15px 0;">总计 <strong>${totalGold} 金币</strong></p>
                <p>兑换后，所有物品将从仓库中移除，并添加到您的金币余额中。</p>
            `}else if(type==='selected'){itemsToRedeem=selectedItemsForRedeem;itemsToRedeem.forEach(item=>{totalGold+=item.value*item.quantity});details=`
                <p>您确定要兑换选中的物品吗？</p>
                <p style="font-size: 1.5rem; color: #FFD700; margin: 15px 0;">总计 <strong>${totalGold} 金币</strong></p>
                <p>兑换后，选中的物品将从仓库中移除，并添加到您的金币余额中。</p>
            `}else if(type==='item'){const item=gameData.items.find(i=>i.id===itemId);if(!item){showMessage('物品不存在','error');return}
const itemQuantity=quantity==='all'?(gameData.currentUser.warehouse||{})[itemId]:1;totalGold=item.value*itemQuantity;itemsToRedeem.push({id:item.id,name:item.name,value:item.value,quantity:itemQuantity});details=`
                <p>您确定要兑换 <strong>${item.name}</strong> 吗？</p>
                <p>数量: ${itemQuantity} 个</p>
                <p style="font-size: 1.5rem; color: #FFD700; margin: 15px 0;">总计 <strong>${totalGold} 金币</strong></p>
                <p>兑换后，物品将从仓库中移除，并添加到您的金币余额中。</p>
            `}
if(redeemConfirmModal){redeemConfirmModal.dataset.redeemItems=JSON.stringify(itemsToRedeem);redeemConfirmDetails.innerHTML=details;redeemConfirmModal.classList.add('active')}else{console.error('兑换确认模态框元素不存在')}}catch(error){console.error('显示兑换确认模态框时出错:',error);showMessage('操作失败，请稍后重试','error')}}
async function redeemAllItems(){if(gameData.currentUser.is_active===!1){showMessage('您的账户已被管理员禁用，无法进行兑换','error');return}
const warehouse=gameData.currentUser.warehouse||{};let totalGold=0;const redeemedItems=[];Object.keys(warehouse).forEach(itemId=>{const item=gameData.items.find(i=>i.id===parseInt(itemId));if(item){const quantity=warehouse[itemId];const itemTotalGold=item.value*quantity;totalGold+=itemTotalGold;redeemedItems.push({id:item.id,name:item.name,value:item.value,quantity:quantity,total:itemTotalGold})}});if(totalGold===0){showMessage('没有可兑换的物品','info');return}
try{const{error:userError}=await supabase.from('users').update({balance:gameData.currentUser.balance+totalGold,warehouse:{},last_login:new Date().toISOString()}).eq('id',gameData.currentUser.id);if(userError)throw userError;gameData.currentUser.balance+=totalGold;gameData.currentUser.warehouse={};updateUserUI();updateWarehouseDisplay();showMessage(`成功兑换全部物品，获得 ${totalGold} 金币！`,'success')}catch(error){console.error('Error redeeming all items:',error);showMessage('兑换失败，请稍后重试','error')}}
async function redeemSelectedItems(){if(gameData.currentUser.is_active===!1){showMessage('您的账户已被管理员禁用，无法进行兑换','error');return}
let totalGold=0;const redeemedItems=[];const newWarehouse={...(gameData.currentUser.warehouse||{})};selectedItemsForRedeem.forEach(itemData=>{const quantity=itemData.quantity;const itemTotalGold=itemData.value*quantity;totalGold+=itemTotalGold;redeemedItems.push({id:itemData.id,name:itemData.name,value:itemData.value,quantity:quantity,total:itemTotalGold});delete newWarehouse[itemData.id]});if(totalGold===0){showMessage('没有可兑换的物品','info');return}
try{const{error:userError}=await supabase.from('users').update({balance:gameData.currentUser.balance+totalGold,warehouse:newWarehouse,last_login:new Date().toISOString()}).eq('id',gameData.currentUser.id);if(userError)throw userError;gameData.currentUser.balance+=totalGold;gameData.currentUser.warehouse=newWarehouse;updateUserUI();updateWarehouseDisplay();showMessage(`成功兑换 ${redeemedItems.length} 个物品，获得 ${totalGold} 金币！`,'success');selectedItemsForRedeem=[]}catch(error){console.error('Error redeeming selected items:',error);showMessage('兑换失败，请稍后重试','error')}}
function updateHistoryDisplay(){if(!historyTableBody)return;historyTableBody.innerHTML='';const userHistory=gameData.userHistory||[];const allHistory=[...userHistory].sort((a,b)=>new Date(b.obtained_at)-new Date(a.obtained_at)).slice(0,50);if(allHistory.length===0){historyTableBody.innerHTML=`
            <tr><td colspan="5" style="text-align: center; color: rgba(255, 215, 0, 0.9);">暂无开盒记录</td></tr>
        `;return}
allHistory.forEach(record=>{let itemName='空盒';let itemIcon='📦';let itemRarity='common';let value=0;let itemMediaHTML='';let quantity=record.quantity||1;if(record.item_id!==0){const item=gameData.items.find(i=>i.id===record.item_id);if(item){itemName=item.name;itemIcon=item.icon;itemRarity=item.rarity;value=record.value;let displayUrl=item.cover_url||item.media_url;if(displayUrl&&displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)){itemMediaHTML=`
                        <div style="display: inline-block; margin-right: 10px; width: 40px; height: 40px; border-radius: 5px; overflow: hidden; vertical-align: middle;">
                            <img src="${displayUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `}}}
const row=document.createElement('tr');const isCurrentUser=gameData.currentUser&&record.user_id===gameData.currentUser.id;let itemDisplay=`${itemMediaHTML}${itemIcon} ${itemName}`;if(quantity>1){itemDisplay+=` x${quantity}`}
row.innerHTML=`
            <td>${formatDateTime(record.obtained_at)}</td>
            <td>${itemDisplay}</td>
            <td>${value} 金币</td>
            <td><span class="item-rarity rarity-${itemRarity}">${getRarityText(itemRarity)}</span></td>
            <td><span class="winner-info ${isCurrentUser ? 'winner-self' : ''}">${record.username || getUsernameById(record.user_id)}</span></td>
        `;historyTableBody.appendChild(row)})}
function updateGlobalHistoryDisplay(){if(!globalHistoryTableBody)return;globalHistoryTableBody.innerHTML='';const userHistory=gameData.userHistory||[];const allHistory=[...userHistory].sort((a,b)=>new Date(b.obtained_at)-new Date(a.obtained_at)).slice(0,50);if(globalHistoryCount){globalHistoryCount.textContent=userHistory.length}
if(allHistory.length===0){globalHistoryTableBody.innerHTML=`
            <tr><td colspan="5" style="text-align: center; color: rgba(255, 215, 0, 0.9);">暂无开盒记录</td></tr>
        `;return}
allHistory.forEach(record=>{let itemName='空盒';let itemIcon='📦';let itemRarity='common';let value=0;let itemMediaHTML='';let quantity=record.quantity||1;if(record.item_id!==0){const item=gameData.items.find(i=>i.id===record.item_id);if(item){itemName=item.name;itemIcon=item.icon;itemRarity=item.rarity;value=record.value;let displayUrl=item.cover_url||item.media_url;if(displayUrl&&displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)){itemMediaHTML=`
                        <div style="display: inline-block; margin-right: 10px; width: 40px; height: 40px; border-radius: 5px; overflow: hidden; vertical-align: middle;">
                            <img src="${displayUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `}}}
const row=document.createElement('tr');let itemDisplay=`${itemMediaHTML}${itemIcon} ${itemName}`;if(quantity>1){itemDisplay+=` x${quantity}`}
row.innerHTML=`
            <td>${formatDateTime(record.obtained_at)}</td>
            <td><span class="winner-info ${record.user_id === gameData.currentUser?.id ? 'winner-self' : ''}">${record.username || getUsernameById(record.user_id)}</span></td>
            <td>${itemDisplay}</td>
            <td>${value} 金币</td>
            <td><span class="item-rarity rarity-${itemRarity}">${getRarityText(itemRarity)}</span></td>
        `;globalHistoryTableBody.appendChild(row)})}
function startHeartbeat(){if(!gameData.currentUser)return;updateLastActive();if(heartbeatInterval)clearInterval(heartbeatInterval);heartbeatInterval=setInterval(()=>{if(gameData.currentUser){updateLastActive();updateOnlineUsersList()}},30000)}
function stopHeartbeat(){if(heartbeatInterval){clearInterval(heartbeatInterval);heartbeatInterval=null}}
async function updateLastActive(){if(!gameData.currentUser)return;try{await supabase.from('users').update({last_active:new Date().toISOString()}).eq('id',gameData.currentUser.id)}catch(e){console.warn('更新最后活动时间失败:',e)}}
async function updateOnlineUsersList(){try{const twoMinutesAgo=new Date(Date.now()-120000).toISOString();const{data,error}=await supabase.from('users').select('id, username, last_active').eq('role','user').eq('is_active',!0).eq('approved',!0).gt('last_active',twoMinutesAgo).order('last_active',{ascending:!1});if(!error){gameData.onlineUsers=data||[]}else{gameData.onlineUsers=[]}}catch(e){gameData.onlineUsers=[]}
if(document.getElementById('chat-section')?.classList.contains('active')){renderOnlineUsers()}}
function updateAdminData(){if(!gameData.currentUser||(gameData.currentUser.role!=='admin'&&gameData.currentUser.role!=='subadmin'))return;if(gameData.currentUser.role==='admin'){adminItemsSection.style.display='block';adminBoxesSection.style.display='block';adminHistorySection.style.display='block';const adminCoinOperationsSection=document.getElementById('adminCoinOperationsSection');if(adminCoinOperationsSection){adminCoinOperationsSection.style.display='block'}}else{adminItemsSection.style.display='none';adminBoxesSection.style.display='none';adminHistorySection.style.display='none'}
const adminCoinOperationsSection=document.getElementById('adminCoinOperationsSection');if(adminCoinOperationsSection){adminCoinOperationsSection.style.display='none'}
if(document.getElementById('adminTotalUsers')){document.getElementById('adminTotalUsers').textContent=gameData.users.length}
if(document.getElementById('adminTodayBoxes')){document.getElementById('adminTodayBoxes').textContent=gameData.userHistory.filter(record=>{const today=new Date().toLocaleDateString();const recordDate=new Date(record.obtained_at).toLocaleDateString();return recordDate===today}).length}
if(document.getElementById('adminTotalItems')){document.getElementById('adminTotalItems').textContent=gameData.items.length}
if(document.getElementById('adminActiveUsers')){document.getElementById('adminActiveUsers').textContent=gameData.users.filter(u=>u.is_active&&u.approved).length}
let totalAdded=0;let totalSubtracted=0;if(gameData.coinOperations){gameData.coinOperations.forEach(op=>{if(op.operation_type==='add'){totalAdded+=op.amount||0}else if(op.operation_type==='subtract'){totalSubtracted+=op.amount||0}})}
const valueDifference=totalAdded-totalSubtracted;if(adminTotalSpentGold){adminTotalSpentGold.textContent=totalAdded}
if(adminTotalObtainedValue){adminTotalObtainedValue.textContent=totalSubtracted}
if(adminValueDifference){adminValueDifference.textContent=valueDifference;if(valueDifference>0){adminValueDifference.style.color='#2ecc71'}else if(valueDifference<0){adminValueDifference.style.color='#e74c3c'}else{adminValueDifference.style.color='#FFD700'}
const adminCoinOperationsSection=document.getElementById('adminCoinOperationsSection');if(adminCoinOperationsSection){if(gameData.currentUser.role==='admin'){adminCoinOperationsSection.style.display='block'}else{adminCoinOperationsSection.style.display='none'}}}
const adminPanelCoinOperationsSection=document.getElementById('adminPanelCoinOperationsSection');if(adminPanelCoinOperationsSection){if(gameData.currentUser.role==='admin'){adminPanelCoinOperationsSection.style.display='block'}else{adminPanelCoinOperationsSection.style.display='none'}}
if(adminUsersTable){adminUsersTable.innerHTML='';let filteredUsers=gameData.users.filter(user=>user.role!=='admin');filteredUsers.sort((a,b)=>{if(a.approved===b.approved){return a.id-b.id}
return a.approved?1:-1});filteredUsers.forEach(user=>{const row=document.createElement('tr');row.innerHTML=`
            <td>${user.username} ${user.role === 'admin' ? '<span class="admin-badge">GM</span>' : user.role === 'subadmin' ? '<span class="subadmin-badge">管理员</span>' : ''}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'GM' : user.role === 'subadmin' ? '管理员' : '普通用户'}</td>
            <td>
                <span class="approval-status ${getApprovalStatusClass(user.approved)}">${getApprovalStatusText(user.approved)}</span>
                ${user.is_active === false ? '<span class="approval-status approval-rejected">已禁用</span>' : ''}
            </td>
            <td>${user.balance}</td>
            <td>${user.gift_balance || 0}</td>   <!-- 新增赠送余额列 -->
            <td>
                ${user.role === 'user' && !user.approved ? `<button class="action-btn approve-btn admin-panel-control" data-user-id="${user.id}" style="display: none;">批准</button><button class="action-btn reject-btn admin-panel-control" data-user-id="${user.id}" style="display: none;">拒绝</button>` : ''}
                <button class="action-btn edit-btn admin-panel-control" data-user-id="${user.id}" style="display: none;">编辑</button>
                <button class="action-btn toggle-status-btn admin-panel-control" data-user-id="${user.id}" data-is-active="${user.is_active}" style="display: none;">
                    ${user.is_active === false ? '启用' : '禁用'}
                </button>
                ${user.role === 'user' ? `<button class="action-btn delete-btn admin-panel-control" data-user-id="${user.id}" style="display: none; background: rgba(255, 71, 87, 0.2); color: #ff4757;">删除</button>` : ''}
            </td>
        `;adminUsersTable.appendChild(row)})}
if(adminItemsTable){adminItemsTable.innerHTML='';const sortedItems=[...gameData.items].sort((a,b)=>{if(a.value!==b.value){return a.value-b.value}
const rarityOrder={'common':1,'uncommon':2,'rare':3,'epic':4,'legendary':5};return rarityOrder[a.rarity]-rarityOrder[b.rarity]});sortedItems.forEach(item=>{let stockClass='stock-full';if(item.remaining<=0){stockClass='stock-empty'}else if(item.remaining<=item.total_limit*0.2){stockClass='stock-low'}
const row=document.createElement('tr');row.innerHTML=`
            <td>${item.icon} ${item.name}</td>
            <td>${item.value} 金币</td>
            <td><span class="item-rarity rarity-${item.rarity}">${getRarityText(item.rarity)}</span></td>
            <td>${item.chance}</td>
            <td>
                <input type="number" class="form-input admin-panel-control" style="width: 80px; padding: 5px; font-size: 0.9rem; display: none;" 
                       value="${item.total_limit}" min="0" max="1000" data-item-id="${item.id}" data-field="totalLimit">
                <span>${item.total_limit}</span>
            </td>
            <td>
                <span class="item-stock-badge ${stockClass}">${item.remaining}/${item.total_limit}</span>
                <input type="number" class="form-input admin-panel-control" style="width: 80px; padding: 5px; font-size: 0.9rem; margin-top: 5px; display: none;" 
                       value="${item.remaining}" min="0" max="${item.total_limit}" data-item-id="${item.id}" data-field="remaining">
            </td>
            <td>
                <button class="action-btn edit-btn admin-panel-control" data-item-id="${item.id}" style="display: none;">编辑</button>
                <button class="action-btn delete-btn admin-panel-control" data-item-id="${item.id}" style="display: none;">删除</button>
            </td>
        `;adminItemsTable.appendChild(row)})}
updateLastResetDate();document.querySelectorAll('button[data-user-id]').forEach(btn=>{btn.addEventListener('click',function(){const userId=parseInt(this.getAttribute('data-user-id'));if(this.classList.contains('edit-btn')){editUser(userId)}else if(this.classList.contains('approve-btn')){approveUser(userId)}else if(this.classList.contains('reject-btn')){rejectUser(userId)}else if(this.classList.contains('toggle-status-btn')){const isActive=this.getAttribute('data-is-active')==='true';toggleUserStatus(userId,isActive)}else if(this.classList.contains('delete-btn')){deleteUser(userId)}})});document.querySelectorAll('button[data-item-id]').forEach(btn=>{btn.addEventListener('click',function(){const itemId=parseInt(this.getAttribute('data-item-id'));if(this.classList.contains('edit-btn')){editItem(itemId)}else if(this.classList.contains('delete-btn')){deleteItem(itemId)}})});document.querySelectorAll('input[data-field="totalLimit"]').forEach(input=>{input.addEventListener('change',async function(){const itemId=parseInt(this.getAttribute('data-item-id'));const newValue=parseInt(this.value);const item=gameData.items.find(i=>i.id===itemId);if(item){try{await supabase.from('items').update({total_limit:newValue}).eq('id',itemId);item.total_limit=newValue;if(item.remaining>newValue){await supabase.from('items').update({remaining:newValue}).eq('id',itemId);item.remaining=newValue}
updateAdminData();showMessage(`物品 ${item.name} 的总数量已更新为 ${newValue}`,'success')}catch(error){console.error('Error updating item total limit:',error);showMessage('更新失败，请稍后重试','error')}}})});document.querySelectorAll('input[data-field="remaining"]').forEach(input=>{input.addEventListener('change',async function(){const itemId=parseInt(this.getAttribute('data-item-id'));const newValue=parseInt(this.value);const item=gameData.items.find(i=>i.id===itemId);updateCoinOperationsDisplay();if(item){const maxValue=item.total_limit;const adjustedValue=Math.min(Math.max(newValue,0),maxValue);try{await supabase.from('items').update({remaining:adjustedValue}).eq('id',itemId);item.remaining=adjustedValue;updateAdminData();showMessage(`物品 ${item.name} 的剩余数量已更新为 ${adjustedValue}`,'success')}catch(error){console.error('Error updating item remaining:',error);showMessage('更新失败，请稍后重试','error')}}})})}
async function resetAllItems(){try{for(const item of gameData.items){await supabase.from('items').update({remaining:item.total_limit}).eq('id',item.id);item.remaining=item.total_limit}
await supabase.from('system_settings').update({last_reset:new Date().toISOString()}).eq('id',1);gameData.systemSettings.last_reset=new Date().toISOString();updateAdminData();showMessage('所有物品数量已重置','success')}catch(error){console.error('Error resetting items:',error);showMessage('重置失败，请稍后重试','error')}}
async function resetToDefault(){const defaultLimits={'common':50,'uncommon':20,'rare':10,'epic':5,'legendary':2};try{for(const item of gameData.items){const defaultLimit=defaultLimits[item.rarity]||10;await supabase.from('items').update({total_limit:defaultLimit,remaining:defaultLimit}).eq('id',item.id);item.total_limit=defaultLimit;item.remaining=defaultLimit}
await supabase.from('system_settings').update({last_reset:new Date().toISOString()}).eq('id',1);gameData.systemSettings.last_reset=new Date().toISOString();updateAdminData();showMessage('所有物品已重置为默认数量','success')}catch(error){console.error('Error resetting to default:',error);showMessage('重置失败，请稍后重试','error')}}
async function resetUnopenedBoxes(){try{showMessage('正在重置...','info');const{data:result,error}=await supabase.rpc('reset_unopened_boxes_by_admin');if(error){console.error('重置:',error);showMessage('重置失败：'+error.message,'error');return}
if(result&&!result.success){showMessage(result.message||'重置失败','error');return}
const{data:updatedRound,error:updateError}=await supabase.from('global_rounds').select('*').eq('id',gameData.globalRound.id).single();if(updateError){console.error('重新加载轮次数据失败:',updateError);showMessage('更新显示失败','warning');return}
gameData.globalRound={...gameData.globalRound,boxes:updatedRound.boxes,preset_generated:updatedRound.preset_generated};if(gameData.currentUser){if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}else if(gameData.currentUser.role==='subadmin'){renderTreasureBoxesForSubadmin()}}
updateAdminHomeStats();showMessage(result.message||'重置成功','success')}catch(error){console.error('重置出错:',error);showMessage('重置失败，请稍后重试','error')}}
async function resetUnopenedBoxesByValue(targetValue){try{showMessage(`正在 ${targetValue} 重置...`,'info');const{data,error}=await supabase.rpc('reset_unopened_boxes_by_value',{target_value:targetValue,tolerance_percent:10,enable_rollback:!0});if(error){throw error}
if(data.success){const roundResponse=await supabase.from('global_rounds').select('*').order('round_id',{ascending:!1}).limit(1).single();if(!roundResponse.error&&roundResponse.data){gameData.globalRound={...gameData.globalRound,...roundResponse.data};if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}
updateAdminHomeStats();showMessage(data.message,'success')}
return data}else{showMessage(data.message,data.success?'success':'error');return data}}catch(error){console.error('Error resetting unopened boxes by value:',error);showMessage('重置失败，请稍后重试','error');return{success:!1,message:'重置失败: '+error.message}}}
async function resetUnopenedBoxesEdgeFunction(resetType='normal',targetValue=null){if(!gameData.currentUser||gameData.currentUser.role!=='admin'){showMessage('需要GM权限','error');return}
try{const token=localStorage.getItem('currentUserToken');const response=await fetch(`${SUPABASE_URL}/functions/v1/reset-unopened-boxes`,{method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json',},body:JSON.stringify({resetType,targetValue})});const result=await response.json();if(response.ok&&result.success){await loadGameData();if(gameData.currentUser.role==='admin'){renderTreasureBoxesForAdmin()}
updateAdminHomeStats();showMessage(result.message,'success')}else{showMessage(result.message||'重置失败','error')}
return result}catch(error){console.error('Error calling edge function:',error);showMessage('调用重置函数失败','error')}}
async function approveUser(userId){const user=gameData.users.find(u=>u.id===userId);if(!user)return;if(gameData.currentUser.role==='subadmin'&&user.role==='admin'){showMessage('管理员不能操作GM账户','error');return}
if(user.approved){showMessage('该用户已经通过审批','info');return}
try{await supabase.from('users').update({approved:!0,balance:gameData.systemSettings.default_user_balance||0,last_login:new Date().toLocaleString()}).eq('id',userId);user.approved=!0;user.balance=gameData.systemSettings.default_user_balance||0;updateAdminData();showMessage(`用户 ${user.username} 已批准，并获得 ${gameData.systemSettings.default_user_balance || 0} 初始金币`,'success')}catch(error){console.error('Error approving user:',error);showMessage('批准失败，请稍后重试','error')}}
async function rejectUser(userId){const user=gameData.users.find(u=>u.id===userId);if(!user)return;if(gameData.currentUser.role==='subadmin'&&user.role==='admin'){showMessage('管理员不能操作GM账户','error');return}
if(!confirm(`确定要拒绝用户 ${user.username} 的注册申请吗？此操作不可撤销。`))return;try{const{data,error}=await supabase.rpc('admin_delete_user',{admin_id:gameData.currentUser.id,target_user_id:userId});if(error)throw error;if(!data.success){showMessage(data.message,'error');return}
gameData.users=gameData.users.filter(u=>u.id!==userId);updateAdminData();showMessage(`用户 ${user.username} 已拒绝并删除`,'success')}catch(error){console.error('Error rejecting user:',error);showMessage('拒绝失败：'+error.message,'error')}}
function editUser(userId){const user=gameData.users.find(u=>u.id===userId);if(!user)return;if(gameData.currentUser.role==='subadmin'&&user.role==='admin'){showMessage('管理员不能编辑GM账户','error');return}
userModalTitle.textContent='编辑用户';document.getElementById('newUsername').value=user.username;document.getElementById('newPassword').value='';document.getElementById('newPasswordConfirm').value='';document.getElementById('newEmail').value=user.email;document.getElementById('newBalance').value=user.balance;document.getElementById('newRole').value=user.role;saveUserBtn.dataset.editingId=userId;userModal.classList.add('active');closeAdminPanel()}
async function toggleUserStatus(userId,currentStatus){const user=gameData.users.find(u=>u.id===userId);if(!user)return;if(gameData.currentUser.role==='subadmin'&&user.role==='admin'){showMessage('管理员不能操作GM账户状态','error');return}
if(user.id===gameData.currentUser.id){showMessage('不能禁用当前登录的账户','error');return}
const newStatus=!currentStatus;const confirmMessage=`确定要${newStatus ? '启用' : '禁用'}用户 ${user.username} 吗？`;if(!confirm(confirmMessage))return;try{await supabase.from('users').update({is_active:newStatus}).eq('id',userId);user.is_active=newStatus;updateAdminData();showMessage(`用户 ${user.username} 已${newStatus ? '启用' : '禁用'}`,'success')}catch(error){console.error('Error toggling user status:',error);showMessage('操作失败，请稍后重试','error')}}
async function deleteUser(userId){const user=gameData.users.find(u=>u.id===userId);if(!user)return;if(gameData.currentUser.role==='subadmin'&&user.role==='admin'){showMessage('管理员不能删除GM账户','error');return}
if(user.role==='admin'||user.role==='subadmin'){showMessage('不能删除管理员账户','error');return}
if(user.id===gameData.currentUser.id){showMessage('不能删除当前登录的账户','error');return}
if(!confirm(`确定要删除用户 ${user.username} 吗？此操作不可撤销。`))return;try{await supabase.from('users').delete().eq('id',userId);await supabase.from('user_history').delete().eq('user_id',userId);gameData.users=gameData.users.filter(u=>u.id!==userId);gameData.userHistory=gameData.userHistory.filter(record=>record.user_id!==userId);updateAdminData();showMessage(`用户 ${user.username} 已删除`,'success')}catch(error){console.error('Error deleting user:',error);showMessage('删除失败，请稍后重试','error')}}
function editItem(itemId){const item=gameData.items.find(i=>i.id===itemId);if(!item)return;itemModalTitle.textContent='编辑物品';document.getElementById('itemName').value=item.name;document.getElementById('itemIcon').value=item.icon;document.getElementById('itemValue').value=item.value;document.getElementById('itemRarity').value=item.rarity;document.getElementById('itemChance').value=item.chance;document.getElementById('itemTotalLimit').value=item.total_limit;document.getElementById('itemDescription').value=item.description;removeMedia();removeCover();if(item.media_url){currentMediaUrl=item.media_url;previewContainer.style.display='block';let previewHTML='';const url=item.media_url;if(url.match(/\.(jpg|jpeg|png|gif|webp)$/i)){previewHTML=`
                <div class="media-preview image-preview">
                    <img src="${url}" alt="预览" class="image-preview">
                </div>
            `;videoCoverUpload.style.display='none'}else if(url.match(/\.(mp4|webm|ogg)$/i)){previewHTML=`
                <div class="media-preview video-preview">
                    <div style="text-align: center; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                        <i class="fas fa-video" style="font-size: 3rem; color: rgba(255, 215, 0, 0.7);"></i>
                        <p style="color: rgba(255, 215, 0, 0.9); margin-top: 10px;">视频文件</p>
                        <p style="color: rgba(255, 215, 0, 0.7); font-size: 0.9rem;">${url.split('/').pop()}</p>
                    </div>
                </div>
            `;videoCoverUpload.style.display='block';if(item.cover_url){currentCoverUrl=item.cover_url;coverPreviewContainer.style.display='block';coverPreviewContent.innerHTML=`
                    <div class="media-preview image-preview">
                        <img src="${item.cover_url}" alt="封面" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                    </div>
                    <div class="file-info">
                        <p><strong>封面预览</strong></p>
                    </div>
                `;removeCoverBtn.style.display='inline-flex'}}else{previewHTML=`
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-file" style="font-size: 3rem; color: rgba(255, 215, 0, 0.7);"></i>
                    <p style="color: rgba(255, 215, 0, 0.9); margin-top: 10px;">已上传的媒体文件</p>
                </div>
            `}
previewHTML+=`
            <div class="file-info">
                <p><strong>媒体URL:</strong></p>
                <p style="word-break: break-all; font-size: 0.8rem;">${url}</p>
                <p style="color: rgba(255, 215, 0, 0.7); font-size: 0.9rem; margin-top: 10px;">
                    重新上传文件将替换现有媒体
                </p>
            </div>
        `;previewContent.innerHTML=previewHTML}
saveItemBtn.dataset.editingId=itemId;itemModal.classList.add('active');closeAdminPanel()}
async function deleteItem(itemId){if(!confirm('确定要删除这个物品吗？'))return;try{await supabase.from('items').delete().eq('id',itemId);for(const user of gameData.users){if(user.warehouse&&user.warehouse[itemId]){const newWarehouse={...user.warehouse};delete newWarehouse[itemId];await supabase.from('users').update({warehouse:newWarehouse}).eq('id',user.id);user.warehouse=newWarehouse}}
gameData.items=gameData.items.filter(item=>item.id!==itemId);updateAdminData();updateWarehouseDisplay();showMessage('物品已删除','success');updateAdminHomeStats()}catch(error){console.error('Error deleting item:',error);showMessage('删除失败，请稍后重试','error')}}
async function saveUser(){const username=document.getElementById('newUsername').value;const password=document.getElementById('newPassword').value;const passwordConfirm=document.getElementById('newPasswordConfirm').value;const email=document.getElementById('newEmail').value;const balance=parseInt(document.getElementById('newBalance').value);const role=document.getElementById('newRole').value;if(!username||!password||!email){showMessage('请填写所有必填字段','error');return}
if(password!==passwordConfirm){showMessage('两次输入的密码不一致','error');return}
if(gameData.currentUser.role==='subadmin'&&role==='admin'){showMessage('管理员不能创建或修改用户为GM','error');return}
const editingId=saveUserBtn.dataset.editingId;try{let usernameExists=!1;let emailExists=!1;if(editingId){const originalUser=gameData.users.find(user=>user.id===parseInt(editingId));if(gameData.currentUser.role==='subadmin'&&originalUser&&originalUser.role==='user'&&role==='admin'){showMessage('管理员不能将用户提升为GM','error');return}
if(gameData.currentUser.role==='subadmin'&&originalUser&&originalUser.role==='admin'){showMessage('管理员不能修改GM账户','error');return}
usernameExists=gameData.users.some((u,index)=>u.id!==parseInt(editingId)&&u.username.toLowerCase()===username.toLowerCase().trim());emailExists=gameData.users.some((u,index)=>u.id!==parseInt(editingId)&&u.email.toLowerCase()===email.toLowerCase().trim())}else{usernameExists=gameData.users.some(u=>u.username.toLowerCase()===username.toLowerCase().trim());emailExists=gameData.users.some(u=>u.email.toLowerCase()===email.toLowerCase().trim())}
if(usernameExists){showMessage('用户名已存在，请使用其他名称','error');return}
if(emailExists){showMessage('邮箱已被注册，请使用其他邮箱','error');return}
if(editingId){const userIndex=gameData.users.findIndex(user=>user.id===parseInt(editingId));if(userIndex!==-1){const updates={username:username.trim(),email:email.trim(),balance,role,last_login:new Date().toLocaleString()};if(password){updates.password=password}
await supabase.from('users').update(updates).eq('id',editingId);gameData.users[userIndex]={...gameData.users[userIndex],...updates}}
delete saveUserBtn.dataset.editingId}else{const{data:existingUsers}=await supabase.from('users').select('username').eq('username',username);if(existingUsers&&existingUsers.length>0){showMessage('用户名已存在','error');return}
const{data:existingEmails}=await supabase.from('users').select('email').eq('email',email);if(existingEmails&&existingEmails.length>0){showMessage('邮箱已被注册','error');return}
const newUser={username:username.trim(),email:email.trim(),password,balance,boxes_opened:0,warehouse:{},level:1,role,join_date:new Date().toISOString().split('T')[0],last_login:null,is_active:!0,approved:role==='admin'||role==='subadmin'?!0:!1,};const{error}=await supabase.from('users').insert([newUser]);if(error)throw error;gameData.users.push(newUser)}
updateAdminData();userModal.classList.remove('active');clearUserForm();showMessage(`用户 ${username} ${editingId ? '已更新' : '已创建'}`,'success');populateUserWarehouseSelect()}catch(error){console.error('Error saving user:',error);showMessage('保存失败，请稍后重试','error')}}
document.getElementById('newUsername')?.addEventListener('blur',checkUsernameAvailability);document.getElementById('newEmail')?.addEventListener('blur',checkEmailAvailability);async function checkUsernameAvailability(){const usernameInput=document.getElementById('newUsername');const username=usernameInput.value.trim();const editingId=saveUserBtn.dataset.editingId;if(!username)return;try{const{data,error}=await supabase.from('users').select('id, username').eq('username',username);if(error){console.error('查询用户名可用性失败:',error);return}
let usernameExists=!1;if(editingId){usernameExists=data.some(user=>user.id!==parseInt(editingId)&&user.username.toLowerCase()===username.toLowerCase())}else{usernameExists=data.some(user=>user.username.toLowerCase()===username.toLowerCase())}
if(usernameExists){usernameInput.style.borderColor='#e74c3c';usernameInput.style.boxShadow='0 0 10px rgba(231, 76, 60, 0.3)';const existingHint=document.getElementById('usernameExistsHint');if(existingHint){existingHint.remove()}
const hint=document.createElement('div');hint.id='usernameExistsHint';hint.style.color='#e74c3c';hint.style.fontSize='0.9rem';hint.style.marginTop='5px';hint.innerHTML='<i class="fas fa-exclamation-circle"></i> 用户名已存在';if(usernameInput.parentNode){usernameInput.parentNode.appendChild(hint)}}else{usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';const existingHint=document.getElementById('usernameExistsHint');if(existingHint){existingHint.remove()}}}catch(error){console.error('检查用户名可用性失败:',error);usernameInput.style.borderColor='rgba(255, 215, 0, 0.3)';usernameInput.style.boxShadow='none';const existingHint=document.getElementById('usernameExistsHint');if(existingHint){existingHint.remove()}}}
async function checkEmailAvailability(){const emailInput=document.getElementById('newEmail');const email=emailInput.value.trim();const editingId=saveUserBtn.dataset.editingId;if(!email)return;try{const{data,error}=await supabase.from('users').select('id, email').eq('email',email);if(error){console.error('查询邮箱可用性失败:',error);return}
let emailExists=!1;if(editingId){emailExists=data.some(user=>user.id!==parseInt(editingId)&&user.email.toLowerCase()===email.toLowerCase())}else{emailExists=data.some(user=>user.email.toLowerCase()===email.toLowerCase())}
if(emailExists){emailInput.style.borderColor='#e74c3c';emailInput.style.boxShadow='0 0 10px rgba(231, 76, 60, 0.3)';const existingHint=document.getElementById('emailExistsHint');if(existingHint){existingHint.remove()}
const hint=document.createElement('div');hint.id='emailExistsHint';hint.style.color='#e74c3c';hint.style.fontSize='0.9rem';hint.style.marginTop='5px';hint.innerHTML='<i class="fas fa-exclamation-circle"></i> 邮箱已被注册';if(emailInput.parentNode){emailInput.parentNode.appendChild(hint)}}else{emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const existingHint=document.getElementById('emailExistsHint');if(existingHint){existingHint.remove()}}}catch(error){console.error('检查邮箱可用性失败:',error);emailInput.style.borderColor='rgba(255, 215, 0, 0.3)';emailInput.style.boxShadow='none';const existingHint=document.getElementById('emailExistsHint');if(existingHint){existingHint.remove()}}}
async function saveItem(){const name=document.getElementById('itemName').value;const icon=document.getElementById('itemIcon').value;const value=parseInt(document.getElementById('itemValue').value);const rarity=document.getElementById('itemRarity').value;const chance=parseInt(document.getElementById('itemChance').value);const totalLimit=parseInt(document.getElementById('itemTotalLimit').value);const description=document.getElementById('itemDescription').value;if(!name||!value||!chance||totalLimit===undefined){showMessage('请填写所有必填字段','error');return}
if(currentMediaFile&&currentMediaFile.type.startsWith('video/')&&!currentCoverFile){showMessage('上传视频必须提供封面图片','error');return}
const editingId=saveItemBtn.dataset.editingId;try{let mediaUrl='';let coverUrl='';if(currentMediaFile){showMessage('正在上传文件...','info');mediaUrl=await uploadMediaFile(currentMediaFile);if(!mediaUrl){showMessage('文件上传失败，物品保存已取消','error');return}
if(currentMediaFile.type.startsWith('video/')&&currentCoverFile){coverUrl=await uploadCoverFile(currentCoverFile);if(!coverUrl){showMessage('封面上传失败，物品保存已取消','error');return}}}else if(editingId){const existingItem=gameData.items.find(item=>item.id===parseInt(editingId));if(existingItem){mediaUrl=existingItem.media_url||'';coverUrl=existingItem.cover_url||''}}
if(editingId){const itemIndex=gameData.items.findIndex(item=>item.id===parseInt(editingId));if(itemIndex!==-1){const oldRemaining=gameData.items[itemIndex].remaining;const updates={name,icon,value,rarity,chance,total_limit:totalLimit,description};if(mediaUrl){updates.media_url=mediaUrl}
if(coverUrl){updates.cover_url=coverUrl}
if(oldRemaining>totalLimit){updates.remaining=totalLimit}
await supabase.from('items').update(updates).eq('id',editingId);gameData.items[itemIndex]={...gameData.items[itemIndex],...updates}}
delete saveItemBtn.dataset.editingId}else{const newItem={name,icon,value,rarity,chance,total_limit:totalLimit,remaining:totalLimit,description};if(mediaUrl){newItem.media_url=mediaUrl}
if(coverUrl){newItem.cover_url=coverUrl}
const{error}=await supabase.from('items').insert([newItem]);if(error)throw error;gameData.items.push(newItem)}
updateAdminData();itemModal.classList.remove('active');clearItemForm();removeMedia();removeCover();showMessage(`物品 ${name} ${editingId ? '已更新' : '已添加'}`,'success');updateAdminHomeStats()}catch(error){console.error('Error saving item:',error);showMessage('保存失败，请稍后重试','error')}}
document.getElementById('itemName')?.addEventListener('blur',checkItemNameAvailability);async function checkItemNameAvailability(){const nameInput=document.getElementById('itemName');const name=nameInput.value.trim();const editingId=saveItemBtn.dataset.editingId;if(!name)return;let nameExists=!1;if(editingId){nameExists=gameData.items.some(item=>item.id!==parseInt(editingId)&&item.name.toLowerCase()===name.toLowerCase())}else{nameExists=gameData.items.some(item=>item.name.toLowerCase()===name.toLowerCase())}
if(nameExists){nameInput.style.borderColor='#e74c3c';nameInput.style.boxShadow='0 0 10px rgba(231, 76, 60, 0.3)';const existingHint=document.getElementById('nameExistsHint');if(existingHint){existingHint.remove()}
const hint=document.createElement('div');hint.id='nameExistsHint';hint.style.color='#e74c3c';hint.style.fontSize='0.9rem';hint.style.marginTop='5px';hint.innerHTML='<i class="fas fa-exclamation-circle"></i> 物品名称已存在';nameInput.parentNode.appendChild(hint)}else{nameInput.style.borderColor='rgba(255, 215, 0, 0.3)';nameInput.style.boxShadow='none';const existingHint=document.getElementById('nameExistsHint');if(existingHint){existingHint.remove()}}}
function populateCoinsUserSelect(filterText=''){if(!coinsUserSelect)return;coinsUserSelect.innerHTML='<option value="">请选择用户</option>';let allowedUsers=gameData.users.filter(user=>user.role==='user'&&user.approved);if(filterText&&filterText.trim()!==''){const lowerFilter=filterText.toLowerCase().trim();allowedUsers=allowedUsers.filter(user=>user.username.toLowerCase().includes(lowerFilter))}
allowedUsers.sort((a,b)=>a.username.localeCompare(b.username));allowedUsers.forEach(user=>{const option=document.createElement('option');option.value=user.id;option.textContent=`${user.username} (当前金币 ${user.balance})`;coinsUserSelect.appendChild(option)});if(allowedUsers.length===0&&filterText&&filterText.trim()!==''){const noResultOption=document.createElement('option');noResultOption.disabled=!0;noResultOption.textContent='没有匹配的用户';coinsUserSelect.appendChild(noResultOption)}}
async function modifyCoins(){const userId=parseInt(coinsUserSelect.value);let operation=coinsOperation.value;let amount=parseInt(document.getElementById('coinsAmount').value);const remark=document.getElementById('coinsRemark').value;if(!userId){showMessage('请选择用户','error');return}
if(operation==='add'||operation==='subtract'||operation==='gift'){if(!amount||amount<=0){showMessage('请输入大于0的金币数量','error');return}}
const user=gameData.users.find(u=>u.id===userId);if(!user){showMessage('用户不存在','error');return}
if(gameData.currentUser.role==='subadmin'&&(user.role==='admin'||user.role==='subadmin')){showMessage('管理员不能修改管理员的金币','error');return}
let newBalance=user.balance;let newGiftBalance=user.gift_balance;let operationText='';let updateData={};switch(operation){case 'add':newBalance+=amount;operationText=`增加 ${amount} 普通金币`;updateData={balance:newBalance};break;case 'subtract':if(user.balance<amount){showMessage('用户普通金币不足，无法减少','error');return}
newBalance-=amount;operationText=`减少 ${amount} 普通金币`;updateData={balance:newBalance};break;case 'set':newBalance=0;operationText=`清空普通金币（原余额 ${user.balance} 金币）`;amount=user.balance;updateData={balance:newBalance};operation='subtract';break;case 'gift':newGiftBalance+=amount;operationText=`赠送 ${amount} 赠送金币`;updateData={gift_balance:newGiftBalance};break;default:return}
try{await supabase.from('users').update(updateData).eq('id',userId);const operationRecord={admin_id:gameData.currentUser.id,admin_username:gameData.currentUser.username,user_id:userId,username:user.username,operation_type:operation,amount:amount,old_balance:user.balance,new_balance:operation==='gift'?user.balance:newBalance,remark:remark||`管理员 ${gameData.currentUser.username} ${operationText}`};const{error:recordError}=await supabase.from('coin_operations').insert([operationRecord]);if(recordError)console.error('记录金币操作失败:',recordError);if(operation==='gift'){user.gift_balance=newGiftBalance;if(gameData.currentUser&&gameData.currentUser.id===userId){gameData.currentUser.gift_balance=newGiftBalance}}else{user.balance=newBalance;if(gameData.currentUser&&gameData.currentUser.id===userId){gameData.currentUser.balance=newBalance}}
modifyCoinsModal.classList.remove('active');showMessage(`成功${operationText}，用户 ${user.username} 当前普通余额 ${user.balance}，赠送余额 ${user.gift_balance}`,'success');updateUserUI();updateAdminData();updateCoinOperationsDisplay()}catch(error){console.error('Error modifying coins:',error);showMessage('修改金币失败，请稍后重试','error')}}
function updateCoinOperationsDisplay(){if(!coinOperationsTableBody){console.warn('coinOperationsTableBody 元素不存在');return}
if(!gameData.coinOperations){gameData.coinOperations=[]}
let filteredOperations=[...gameData.coinOperations];const filterUser=coinOperationsFilterUser?coinOperationsFilterUser.value:'';if(filterUser){filteredOperations=filteredOperations.filter(record=>record.user_id&&record.user_id.toString()===filterUser)}
const filterType=coinOperationsFilterType?coinOperationsFilterType.value:'';if(filterType){filteredOperations=filteredOperations.filter(record=>record.operation_type===filterType)}
const filterDate=coinOperationsFilterDate?coinOperationsFilterDate.value:'';if(filterDate){const today=new Date();const startOfToday=new Date(today.getFullYear(),today.getMonth(),today.getDate());const startOfYesterday=new Date(startOfToday);startOfYesterday.setDate(startOfYesterday.getDate()-1);const startOfWeek=new Date(today);startOfWeek.setDate(today.getDate()-today.getDay());const startOfMonth=new Date(today.getFullYear(),today.getMonth(),1);filteredOperations=filteredOperations.filter(record=>{if(!record.created_at)return!1;const recordDate=new Date(record.created_at);switch(filterDate){case 'today':return recordDate>=startOfToday;case 'yesterday':return recordDate>=startOfYesterday&&recordDate<startOfToday;case 'week':return recordDate>=startOfWeek;case 'month':return recordDate>=startOfMonth;default:return!0}})}
coinOperationsFilteredData=filteredOperations;updateCoinOperationsStats();const totalRecords=filteredOperations.length;const totalPages=Math.max(1,Math.ceil(totalRecords/coinOperationsPageSize));const startIndex=(coinOperationsCurrentPage-1)*coinOperationsPageSize;const endIndex=Math.min(startIndex+coinOperationsPageSize,totalRecords);const pageData=filteredOperations.slice(startIndex,endIndex);coinOperationsTableBody.innerHTML='';if(pageData.length===0){coinOperationsTableBody.innerHTML=`
            <tr>
                <td colspan="8" style="text-align: center; color: rgba(255, 215, 0, 0.9); padding: 30px;">
                    <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 15px; display: block;"></i>
                    <p>暂无金币操作记录</p>
                    <p style="font-size: 0.9rem; color: rgba(255, 215, 0, 0.7); margin-top: 10px;">
                        修改用户金币后，记录将自动显示在这里
                    </p>
                </td>
            </tr>
        `}else{const groupedData={};pageData.forEach(record=>{if(!record.created_at)return;const recordDate=new Date(record.created_at);const today=new Date();if(recordDate.toDateString()===today.toDateString()){if(!groupedData.today)groupedData.today=[];groupedData.today.push(record)}else{const dateKey=recordDate.toLocaleDateString();if(!groupedData[dateKey])groupedData[dateKey]=[];groupedData[dateKey].push(record)}});const sortedDates=Object.keys(groupedData).sort((a,b)=>{if(a==='today')return-1;if(b==='today')return 1;return new Date(b)-new Date(a)});sortedDates.forEach(dateKey=>{const records=groupedData[dateKey];if(dateKey!=='today'){const dateRow=document.createElement('tr');dateRow.style.backgroundColor='rgba(255, 215, 0, 0.1)';dateRow.innerHTML=`
                    <td colspan="8" style="text-align: center; padding: 8px; color: #FFD700; font-weight: bold;">
                        <i class="fas fa-calendar-day"></i> ${dateKey} (${records.length}条记录)
                    </td>
                `;coinOperationsTableBody.appendChild(dateRow)}
records.forEach(record=>{const operationTypeText={'add':'增加','subtract':'减少','set':'设置','gift':'赠送'}[record.operation_type]||record.operation_type;const operationTypeClass={'add':'operation-add','subtract':'operation-subtract','set':'operation-set','gift':'operation-gift'}[record.operation_type]||'';let timeDisplay='';if(record.created_at){const recordDate=new Date(record.created_at);const today=new Date();if(recordDate.toDateString()===today.toDateString()){timeDisplay=recordDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}else{timeDisplay=recordDate.toLocaleString()}}
const row=document.createElement('tr');row.innerHTML=`
                    <td>${timeDisplay || '未知时间'}</td>
                    <td><span class="admin-name">${record.admin_username || '未知管理员'}</span></td>
                    <td><span class="user-name">${record.username || '未知用户'}</span></td>
                    <td><span class="operation-type ${operationTypeClass}">${operationTypeText}</span></td>
                    <td><strong>${record.amount || 0}</strong></td>
                    <td>${record.old_balance || 0}</td>
                    <td><strong style="color: #FFD700;">${record.new_balance || 0}</strong></td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
                        title="${record.remark || ''}">${record.remark || ''}</td>
                `;coinOperationsTableBody.appendChild(row)})})}
updateCoinOperationsPagination(totalRecords,totalPages)}
function updateCoinOperationsPagination(totalRecords,totalPages){const pageInfo=document.getElementById('coinOperationsPageInfo');const prevBtn=document.getElementById('coinOperationsPrevPage');const nextBtn=document.getElementById('coinOperationsNextPage');if(pageInfo){pageInfo.textContent=`第 ${coinOperationsCurrentPage} / ${totalPages} 页 (共 ${totalRecords} 条)`}
if(prevBtn){prevBtn.disabled=coinOperationsCurrentPage<=1;prevBtn.style.display=totalPages>1?'inline-flex':'none'}
if(nextBtn){nextBtn.disabled=coinOperationsCurrentPage>=totalPages;nextBtn.style.display=totalPages>1?'inline-flex':'none'}
if(coinOperationsCount){coinOperationsCount.textContent=totalRecords}}
function updateCoinOperationsStats(){const today=new Date();const startOfToday=new Date(today.getFullYear(),today.getMonth(),today.getDate());const todayOperations=coinOperationsFilteredData.filter(record=>{if(!record.created_at)return!1;const recordDate=new Date(record.created_at);return recordDate>=startOfToday});const todayAddTotal=todayOperations.filter(record=>record.operation_type==='add').reduce((sum,record)=>sum+(record.amount||0),0);const todaySubtractTotal=todayOperations.filter(record=>record.operation_type==='subtract').reduce((sum,record)=>sum+(record.amount||0),0);document.getElementById('todayOperationsCount').textContent=todayOperations.length;document.getElementById('todayAddTotal').textContent=todayAddTotal;document.getElementById('todaySubtractTotal').textContent=todaySubtractTotal}
function goToCoinOperationsPrevPage(){if(coinOperationsCurrentPage>1){coinOperationsCurrentPage--;updateCoinOperationsDisplay()}}
function goToCoinOperationsNextPage(){const totalPages=Math.max(1,Math.ceil(coinOperationsFilteredData.length/coinOperationsPageSize));if(coinOperationsCurrentPage<totalPages){coinOperationsCurrentPage++;updateCoinOperationsDisplay()}}
function changeCoinOperationsPageSize(){coinOperationsPageSize=parseInt(document.getElementById('coinOperationsPageSize').value)||20;coinOperationsCurrentPage=1;updateCoinOperationsDisplay()}
function populateCoinOperationsFilterUser(){if(!coinOperationsFilterUser)return;coinOperationsFilterUser.innerHTML='<option value="">所有用户</option>';const users=gameData.users.filter(user=>user.role==='user');users.forEach(user=>{const option=document.createElement('option');option.value=user.id;option.textContent=`${user.username} (ID: ${user.id})`;coinOperationsFilterUser.appendChild(option)})}
document.addEventListener('DOMContentLoaded',init)})()