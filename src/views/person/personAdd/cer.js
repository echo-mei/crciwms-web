//点击读二代证按钮，获取身份证号信息
function setid() {
	ClearIDCard(); //读前清理读卡器缓存
	if (!readIDCard()) {
		alert('Read Card Fail!');
		return
	}
	var pName = CVR_IDCard.NameL;
	var pSex = CVR_IDCard.SexL;
	var pNation = CVR_IDCard.NationL;
	var pBorn = CVR_IDCard.BornL;
	var pAddress = CVR_IDCard.Address;
	var pCardNo = CVR_IDCard.CardNo;
	var pPolice = CVR_IDCard.Police;
	var pActivity = CVR_IDCard.Activity;
	var pNewAddr = CVR_IDCard.NewAddr;
	var pActivityLFrom = CVR_IDCard.ActivityLFrom;
	var pActivityLTo = CVR_IDCard.ActivityLTo;
	var pPhotoBuffer = CVR_IDCard.GetPhotoBuffer;

	$("#zjbh").val(pCardNo);
	$("#sqr").val(pName);
	$("#zjdz").val(pAddress);
	$("#pSex").val(pSex);
	$("#pBorn").val(pBorn);
	$('#img_app_pic').attr("src", "data:image/gif;base64," + pPhotoBuffer);

	//ClearIDCard(); //读后清理读卡器缓存
	//CVR_IDCard.DoStopRead; //停止读卡
}
function ClearIDCard() {
	console.log(CVR_IDCard,CVR_IDCard.name,CVR_IDCard.NameL);
	CVR_IDCard.Name = "";
	CVR_IDCard.NameL = "";
	CVR_IDCard.Sex = "";
	//CVR_IDCard.SexL="";   
	CVR_IDCard.Nation = "";
	//CVR_IDCard.NationL="";
	CVR_IDCard.Born = "";
	//CVR_IDCard.BornL="";
	CVR_IDCard.Address = "";
	CVR_IDCard.CardNo = "";
	CVR_IDCard.Police = "";
	CVR_IDCard.Activity = "";
	CVR_IDCard.NewAddr = "";
	return true;
}
function readIDCard() {
	var strReadResult = CVR_IDCard.ReadCard;
	if (strReadResult == "0") {
		return true;
	}
	return false;
}

export {  setid  }  