import { MauCauTu } from './template/MauCauTu.js';
import { MauCauGiaThietGiaTri} from './template/MauCauGiaTri.js';
import { MauCauHinh } from './template/MauCauHinh.js';
import { BieuThuc} from './template/BieuThuc.js';
import { MauCauKetLuan } from './template/MauCauKetLuan.js'; 
  
let DeBai = document.querySelector('.debai');
let GiaThiet = document.querySelector('.giathiet');
let KetLuan = document.querySelector('.ketkuan');
const btnKetQuan = document.querySelector('.thuchien');
/**
 * 
 * 
 * 
 * TODO: Xây dựng xong câu cho hình
 *       Xây dựng mẫu câu cho Kết Luận 
 * 
 *  =====> XONG 80% OKKKKKKKKKKK
 * 
 */

// TODO: Khai báo và gán các data text 
let DSTuXoa = convertStrtoArray( readTextFile('data/TuXoa.txt'),';');
let QuyUocChung = XuLyQuyUoc('data/QuyUoc.txt');
console.log(QuyUocChung);

// Tạo các QUY ƯỚC CHUYỂN ĐỔI TỪ
function XuLyQuyUoc(pathStr){
    let DsQuyUoc;
    let QuyUoc = convertStrtoArray(readTextFile(pathStr),';');
    QuyUoc.pop();
    DsQuyUoc = QuyUoc.map(function(e){
        return convertStrtoArray(e,'>')
    })

    return DsQuyUoc;
}

function XuLyChuyenDoiQuyUoc(str, arr) {
    let tempStr, rexDeg;

    for(let i = 0; i < arr.length; i++){
        rexDeg = new RegExp(arr[i][0], 'g');
        if(tempStr){
            tempStr = tempStr.replace(rexDeg,arr[i][1]);
        } else {
            tempStr = str.replace(rexDeg,arr[i][1]);
        }
    
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}

/* =================================
Sự kiện click thực hiện chương trình
====================================*/
btnKetQuan.addEventListener('click', function(e){
    e.preventDefault();

    // Xóa các ký hiệu 
    const debaiStr = XoaCacKyHieu(DeBai.value);
    //Chuyển đổi Quy ƯỚC
    const debaiStrQuyUoc = XuLyChuyenDoiQuyUoc(debaiStr, QuyUocChung);
    // Xóa các từ thừa
    const debaiStrXoaTuThua = XoaTuThua(debaiStrQuyUoc);
    
    // console.log(debaiStr);
    // console.log(debaiStrQuyUoc);
    console.log(debaiStrXoaTuThua);
    

// TODO: Xử lý nhận dạng tách thành 2 phần GIẢ THIẾT và KẾT LUẬN
    const {GiaThietTemp, KetLuanTemp} = TachGiathietKetLuan(debaiStrXoaTuThua);
    GiaThiet.value = GiaThietTemp;
    KetLuan.value = KetLuanTemp;
// TODO: Xử lý phần GIẢ THIẾT
    XuLyGiaThiet(GiaThietTemp);
// TODO: Xử lý phần KẾT LUẬN
    XuLyKetLuan(KetLuanTemp);

})





/* =================================
Xác định phần giả thuyết và kết luận dựa vào các từ đăc trưng và đồng nghĩa
====================================*/
function TachGiathietKetLuan(str){
    let strTemp;
    let strArr = convertStrtoArray(str.trim(),' ');
    console.log(strArr)
    let wordTach = convertStrtoArray(readTextFile('data/QuyUocTachGTKL.txt'), ';');
    let breakPoint, checkExit = false;

    for(let i= 0; i< wordTach.length; i++){

        for(let j = 0; j< strArr.length; j++){
            if(strArr[j] === wordTach[i]){
                breakPoint = j;
                checkExit = true;
                break;
            }
        }

        if(checkExit) break;
    }
    //console.log(breakPoint);
    strTemp = strArr.slice(breakPoint);
    return {
        'GiaThietTemp': strArr.slice(0,breakPoint).join(' '),
        'KetLuanTemp': strTemp.join(' ')
    }

}

function XuLyGiaTriDaBiet(arrGiaTri){
    let arrGoc;
    for(let i = 0; i < arrGiaTri.length; i++){
        if(arrGiaTri[i].match(/[Gg]óc/g)){
            arrGoc = convertStrtoArray(arrGiaTri[i].replace(/[Gg]óc/,'').trim()," ");
            let temp = 'Góc(' + arrGoc[0] + ')' +arrGoc[1]+ arrGoc[2];
            arrGiaTri[i] =  temp;
        }
    }


    return arrGiaTri;
}


/* ================================
    XỬ LÝ PHẦN GIẢ THIẾT 
==============(======================*/
function XuLyGiaThiet(giathiet) {
  
    console.log(giathiet)

    let BieuThucKQ = [], regdexBieuThuc, strBieuThuc;
    for(let n = 0; n < BieuThuc.length; n++){
        regdexBieuThuc = new RegExp(BieuThuc[n],'g')
        if(giathiet.match(regdexBieuThuc)){
            BieuThucKQ.push(...giathiet.match(regdexBieuThuc));
            giathiet = giathiet.replace(regdexBieuThuc,"");
        } else continue;
    }
    console.log(BieuThucKQ);


    let LocGiaTri = [],LocCauMau = [], rexdegGiaTri, rexDegCau , CauDaTrung,MauCau, LocCauMauTemp = [];
    
    for(let i = 0; i < MauCauGiaThietGiaTri.length; i++){
        rexdegGiaTri = new RegExp(MauCauGiaThietGiaTri[i],'g');
        // console.log(rexdegGiaTri);
        if(giathiet.match(rexdegGiaTri)){
            // console.log(giathiet.match(rexdegGiaTri));
            LocGiaTri.push(...giathiet.match(rexdegGiaTri));
            giathiet = giathiet.replace(rexdegGiaTri,"");
        } else continue;
    }
    // console.log(MauCauTu);
    console.log(LocGiaTri);
    XuLyGiaTriDaBiet(LocGiaTri);
    for(let j = 0;j < MauCauTu.length; j++){
        rexDegCau = new RegExp(MauCauTu[j][0],'g');
        if(giathiet.match(MauCauTu[j][0])){
            CauDaTrung = giathiet.match(rexDegCau);
            MauCau = (MauCauTu[j][1]);
            LocCauMauTemp.push(CauDaTrung);
            LocCauMauTemp.push(MauCau);
            LocCauMau.push(LocCauMauTemp);
            giathiet = giathiet.replace(rexDegCau,"");
            LocCauMauTemp = [];
        } else continue;
    }
    console.log(LocCauMau);
    let KetQuaCau = [], arrTemp, arrNameTemp = [], strKetQua, x = 0, regdexNum;
    // console.log(LocCauMau);
    for(let a = 0; a < LocCauMau.length; a++){
    //    console.log(LocCauMau[a]);
    //    console.log(LocCauMau[a][1]);
       for(let b = 0; b < LocCauMau[a][0].length; b++){
        // console.log(LocCauMau[a][0][b], LocCauMau[a][0].length);
           arrTemp = convertStrtoArray(LocCauMau[a][0][b], " ");
            while(x < arrTemp.length){
                if(isUpper(arrTemp[x])){
                    arrNameTemp.push(arrTemp[x]);
                }
                x++;
            }

            // console.log(arrNameTemp);
            for(let y = 0; y < arrNameTemp.length; y++){
                regdexNum = new RegExp(y);
                // console.log(LocCauMau[a][1]);
                if(strKetQua){
                    strKetQua = strKetQua.replace(regdexNum, arrNameTemp[y]);
                    // console.log(strKetQua);
                } else {
                    // console.log(strKetQua);
                    strKetQua = LocCauMau[a][1].replace(regdexNum, arrNameTemp[y]);
                } 
            }

            KetQuaCau.push(strKetQua);
            strKetQua = "";
            arrNameTemp = [];
            x = 0;
        }
    
    }

    console.log(KetQuaCau);
   console.log(giathiet);

    let GiaThietConLai = [], GiaThietTempTrung = [], GiaThietConLaiMau = [],regdexHinh, strConLai;
   for(let p = 0; p < MauCauHinh.length; p++){
       regdexHinh =  new RegExp(MauCauHinh[p][0],'g');
       if(giathiet.match(regdexHinh)){
           strConLai = [...giathiet.match(regdexHinh)];
           console.log(strConLai);
           giathiet = giathiet.replace(regdexHinh,'');
           GiaThietTempTrung.push(strConLai);
       }
   }

   let GTHinh = [];
   for(let n = 0; n < GiaThietTempTrung.length; n++){
       GTHinh.push(...GiaThietTempTrung[n]);
   }
   console.log(GiaThietTempTrung);
   console.log(GTHinh);
//    console.log(GiaThietConLaiMau);
   console.log(giathiet);

//    const [strKQ] = GiaThietTempTrung;
//    console.log(strKQ);

   let KQGiaThiet = '';
   if(GTHinh.length === 0) KQGiaThiet = ''; 
    else KQGiaThiet +=GTHinh.join(';')
   if(KetQuaCau.length === 0) KQGiaThiet 
   else KQGiaThiet += LocGiaTri.join(';');

   if(LocGiaTri.length === 0) KQGiaThiet =  KQGiaThiet;


    GiaThiet.value = GTHinh.join(';') + ';' + KetQuaCau.join(';') + ';' + LocGiaTri.join(';') ;
}



/* ================================
    XỬ LÝ PHẦN KẾT LUẬN 
====================================*/
function XuLyKetLuan(strKetLuan) {
    let strKLTemp, regdexKl;
    let DOANTHANG = [], TAMGIAC = [], GOC = [], TUGIAC = [];
    let indexItem = []
    const QuyUocKetLuan = XuLyQuyUoc('data/QuyUocChoKetLuan.txt');

    for(let i = 0; i < QuyUocKetLuan.length; i++){
        regdexKl = new RegExp(QuyUocKetLuan[i][0],'g');
        if(strKLTemp){
            strKLTemp = strKLTemp.replace(regdexKl,QuyUocKetLuan[i][1]);
        } else {
            strKLTemp = strKetLuan.replace(regdexKl,QuyUocKetLuan[i][1]);
        }
    }
    // console.log(strKLTemp);
    const strKLTempArr = convertStrtoArray(strKLTemp.trim().replace(/\s+/g, ' '),' ');
    let checkGoc = strKLTemp.trim().replace(/\s+/g, ' ');
    console.log(strKLTempArr);
    for(let i = 0; i < strKLTempArr.length; i++){
        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 2){
            DOANTHANG.push(strKLTempArr[i]);
            continue;
        }

        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 3){
            if(strKLTempArr[i-1] === 'góc' || !checkGoc.includes('giác')){
                GOC.push('Góc('+ strKLTempArr[i] + ')');
                continue;
            } else {
                TAMGIAC.push(strKLTempArr[i]);
                indexItem.push(i);
                continue;
            }
        } 

        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 4){
            TUGIAC.push(strKLTempArr[i]);
            indexItem.push(i);

            continue;
         }
         
        }


    let strKL ='';
    if(GOC.length !== 0){
        strKL += (strKL !== '' ? ','+GOC.join(','):GOC.join(','));
    }
    if(DOANTHANG.length !== 0) {
        strKL += (strKL !== '' ? ','+DOANTHANG.join(','):DOANTHANG.join(','));
    }
    KetLuan.value = strKL + ';';
   

    console.log(strKetLuan);

    let KetQuaKetLuan = [], KetLuanCauSan = [], regdexKetLuan, tempStrKetLuan = [];
    for(let x = 0; x < MauCauKetLuan.length; x++){
        console.log(MauCauKetLuan[x][0]);
        regdexKetLuan = new RegExp(MauCauKetLuan[x][0],'g');
        if(strKetLuan.match(regdexKetLuan)){
            tempStrKetLuan.push(strKetLuan.match(regdexKetLuan));
            strKetLuan =  strKetLuan.replace(regdexKetLuan,'');
        } else continue;
        
    }
    console.log(tempStrKetLuan);
    console.log(strKetLuan);
}


/* ================================
   HÀM XỬ LÝ 
====================================*/

///Chuyển đổi string sang mảng
function convertStrtoArray(str, character){
    return str.split(character);
}

//CHuyển chuỗi thành 1 kiểu định dạng
function convertStrtoUpperCase(str){
    return str.toUpperCase();
}
function convertStrtoLowerCase(str){
    return str.toLowerCase();
}


/* =================================
    Xóa các khoảng trống dư thừa
    Xóa các ký tự đặc biệt
====================================*/
function XoaCacKyHieu(str){
    return str.replace(/[\n,.;)(:\/?]|cm|km|mm|cm2|mm2|deg|hm|dam|dm|mm|m2|km2/g,' ').trim().replace(/\s+/g, ' ');
    // str.replace(/\n/g,'').replace(/[,.]/g,' ').replace(/cm/g,'');
}


// Kiểm tra  là toàn chữ là in hoa
function isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}


//TODO: Xóa các từ đã xử lý thông qua chỉ số
function removeArrbyIndex(arr,arrIndex){

    for(let i = 0; i < arrIndex.length; i++){
        arr[arrIndex[i]] = '';
    }

    arr.join('');
    return convertStrtoArray(arr.join(' ').trim().replace(/\s+/g, ' '), ' ');    
}




//Xóa các từ thông dụng
function XoaTuThua(str){
    let redexWord, tempStr;
    DSTuXoa.pop();
    for(let i= 0; i< DSTuXoa.length; i++){
        redexWord =  new RegExp(DSTuXoa[i],'g');
        if(tempStr){
            tempStr = tempStr.replace(redexWord,' ');
        } else {
            tempStr = str.replace(redexWord,' ');
        }
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}

// TODO:  đọc file data text
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // alert(allText);
            }
        }
    }
    rawFile.send(null);

    return allText;
}