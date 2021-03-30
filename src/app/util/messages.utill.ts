import Swal from 'sweetalert2';

export default class MessagesUtil {
    static errorMessage(message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });
    }

    static infoMessage(message: string) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: message
        });
    }

    static successMessage(tittle: string, message: string) {
        Swal.fire({
            icon: 'success',
            title: tittle,
            text: message
        });
    }

    static deleteMessage(id: number, callback: any) {
        Swal.fire({
            title: '¿Deseas eliminar el registro?',
            text: 'Se eliminara de manera permanente',
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                callback(id);
            }
        });
    }

    static actionMessage(title: string, text: string, callback: any, parameter?: any) {
        Swal.fire({
            title: title,
            text: text,
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                callback(parameter);
            }
        });
    }

    static getMessageError(code: number): string {
        let message = '';

        switch (code) {
            case 400:
                message = 'El servicio no esta disponible';
                break;
            case 500:
                message = 'El servicio no esta disponible';
                break;
        }
        return '';
    }
}
