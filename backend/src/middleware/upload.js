const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'avatar') {
            uploadPath += 'avatars/';
        } else if (file.fieldname === 'chungchi') {
            uploadPath += 'chungchi/';
        } else if (file.fieldname === 'hopdong') {
            uploadPath += 'hopdong/';
        } else if (file.fieldname === 'giaythaisan') {
            uploadPath += 'giaythaisan/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const date = new Date().toISOString().replace(/[-:.]/g,'');
        const ext = path.extname(file.originalname);
        cb(null, `${date}${ext}`);     
    }
});

const fileFilter = (req, file, cb) => {
    // images only
    if (file.fieldname === 'avatar') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Avatar chỉ chấp nhận file ảnh!'), false);
        }
    }
    // images and PDFs
    else if (file.fieldname === 'chungchi') {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Chứng chỉ chỉ chấp nhận file ảnh hoặc PDF!'), false);
        }
    }
    // PDFs and DOCX
    else if (file.fieldname === 'hopdong') {
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Hợp đồng chỉ chấp nhận file PDF hoặc DOCX!'), false);
        }
    }
    // images and PDFs
    else if (file.fieldname === 'giaythaisan') {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Giấy tờ thai sản chỉ chấp nhận file ảnh hoặc PDF!'), false);
        }
    }
    else {
        cb(new Error('Loại file không được hỗ trợ!'), false);
    }
};

// Giới hạn kích thước file
const uploadAvatar = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});

const uploadChungChi = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 
    }
});

const uploadHopDong = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 
    }
});

const uploadGiayThaiSan = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 
    }
});

module.exports = {
    uploadAvatar,
    uploadChungChi,
    uploadHopDong,
    uploadGiayThaiSan
}; 