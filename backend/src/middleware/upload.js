const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine destination based on field name
        let uploadPath = 'uploads/';
        if (file.fieldname === 'avatar') {
            uploadPath += 'avatars/';
        } else if (file.fieldname === 'chungchi') {
            uploadPath += 'chungchi/';
        } else if (file.fieldname === 'hopdong') {
            uploadPath += 'hopdong/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for different types
const fileFilter = (req, file, cb) => {
    // Handle avatar uploads (images only)
    if (file.fieldname === 'avatar') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Avatar chỉ chấp nhận file ảnh!'), false);
        }
    }
    // Handle chungchi uploads (images and PDFs)
    else if (file.fieldname === 'chungchi') {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Chứng chỉ chỉ chấp nhận file ảnh hoặc PDF!'), false);
        }
    }
    // Handle hopdong uploads (PDFs and DOCX)
    else if (file.fieldname === 'hopdong') {
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Hợp đồng chỉ chấp nhận file PDF hoặc DOCX!'), false);
        }
    }
    else {
        cb(new Error('Loại file không được hỗ trợ!'), false);
    }
};

// Create multer upload instances with different limits
const uploadAvatar = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit for avatars
    }
});

const uploadChungChi = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for certificates
    }
});

const uploadHopDong = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for contracts
    }
});

module.exports = {
    uploadAvatar,
    uploadChungChi,
    uploadHopDong
}; 