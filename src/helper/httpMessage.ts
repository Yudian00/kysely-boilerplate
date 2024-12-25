export enum HttpMessage {
    DETAIL_CANNOT_BE_EMPTY = 'Detail tidak boleh kosong',
    SOMETHING_WRONG = 'Something went wrong',
    CREATE_SUCCESS = 'Berhasil membuat data',
    UPDATE_SUCCESS = 'Berhasil mengupdate data',
    DELETE_SUCCESS = 'Berhasil menghapus data',
    GET_SUCCESS = 'Berhasil mendapatkan data',
    NOT_FOUND = 'Data tidak ditemukan',
    FAILED_UPDATE = 'Gagal saat melakukan update data',
    CANNOT_CHANGE_STATUS = 'Status tidak dapat dirubah',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    BAD_REQUEST = 'Bad Request',
    VALIDATION_ERROR = 'Validasi error',
    IMAGE_NOT_FOUND = 'File image tidak ditemukan',
    ERROR_FIELD_UPLOAD = 'Field upload yang digunakan tidak sesuai. Silahkan cek kembali',
    HISTORY_ENTRY_FAILED = 'Gagal menambahkan history entry',
    HISTORY_EXIT_FAILED = 'Gagal menambahkan history exit',
}

export enum HttpError {
    DETAIL_CANNOT_BE_EMPTY = 'Detail is required',
    NOT_FOUND = 'Data not found',
    IMAGE_NOT_FOUND = 'Image file not found',
    FAILED_UPDATE = 'Failed when update data',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    CANNOT_CHANGE_STATUS = 'Data cannot be verified due to ineligible status',
    ERROR_FIELD_UPLOAD = 'Unexpected field. Please use the correct field name for file upload.',
    BAD_REQUEST = 'Bad Request',
}