
const VALID_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "mpeg", "mp3"];

export const fileExtensionFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if(!file) return callback( new Error('File is empty'), false);

    const type = file.mimetype.split('/')[1];

    if(VALID_EXTENSIONS.includes(type)) return callback(null, true);

    callback(null, false);
}