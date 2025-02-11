export const messagesObj = {
    es: {
        newItemSuccess: {
            title: 'Elemento creado',
            text: "El elemento se ha creado correctamente",
            icon: "success"
        },
        newItemError: {
            title: 'Error',
            text: "Error creando elemento",
            icon: "error"
        },
        newItemImageError: {
            title: 'Error',
            text: "Error guardando imagen",
            icon: "error"
        },
        editItemSuccess: {
            title: 'Elemento editado',
            text: "El elemento se ha editado correctamente",
            icon: "success"
        },
        editItemError: {
            title: 'Error',
            text: "Error editando elemento",
            icon: "error"
        },
        editItemImageError: {
            title: 'Error',
            text: "Error actualizando imagen",
            icon: "error"
        },
        deleteItemConfirmation: {
            title: 'Estas seguro?',
            text: "Una vez borrado no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e32e36',
            cancelButtonColor: '#1b263b',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'

        },
        deleteItemSuccess: {
            title: 'Elemento eliminado',
            text: "El elemento se ha eliminado correctamente",
            icon: "success"
        },
        deleteItemError: {
            title: 'Error',
            text: "Error eliminando elemento",
            icon: "error"
        },
        sessionError: {
            title: 'Error',
            text: 'La sesión ha caducado',
            icon: "error"
        },
        accessDeniedError: {
            title: 'Error',
            text: 'Acceso denegado a este trastero',
            icon: "error"
        },
        itemNotFoundError: {
            title: 'Error',
            text: 'Elemento no encontrado',
            icon: "error"
        },
        networkError: {
            title: 'Error',
            text: 'Error de conexión',
            icon: "error"
        },
        unexpectedError: {
            title: 'Error',
            text: 'Error inexperado, intentalo más tarde',
            icon: "error"
        },
        passwordUpdated: {
            title: 'contraseña actualizada',
            // text: 'Password updated',
            icon: "success"
        },
        storageRoomCreated: {
            title: "Trastero creado",
            icon: "success"
        },
        deleteStorageRoomConfirmation: {
            title: "¿Estás seguro?",
            text: "Una vez eliminado no podrá ser recuperado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e32e36',
            cancelButtonColor: '#1b263b',
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        },
        deleteStorageRoomNoPermission: {
            title: 'Error',
            text: 'Solo el administrador del trastero puede acceder a ajustes',
            icon: "error"
        },
        readOnlyPermission: {
            title: 'Error',
            text: 'Solo tienes permisos de lectura',
            icon: "error"
        },
        deleteStorageRoomDeletionSuccess: {
            title: 'Trastero eliminado',
            // text: 'Only the admin of the storage room can access to settings',
            icon: "success"
        },
        emailVerifiedSuccess: {
            title: 'Email verificado',
            text: 'Ahora puedes acceder',
            icon: "success"
        },
        UserNotFoundException: {
            title: 'Email no encontrado',
            icon: "error"
        }
    },
    en: {
        newItemSuccess: {
            title: "Item created",
            text: "Item created successfully",
            icon: "success"
        },
        newItemError: {
            title: 'Error',
            text: "Error creating item",
            icon: "error"
        },
        newItemImageError: {
            title: "Error",
            text: "Error saving image",
            icon: "error"
        },
        editItemSuccess: {
            title: "Item edited",
            text: "Item edited successfully",
            icon: "success"
        },
        editItemError: {
            title: 'Error',
            text: "Error editing item",
            icon: "error"
        },
        editItemImageError: {
            title: 'Error',
            text: "Error updating image",
            icon: "error"
        },
        deleteItemConfirmation: {
            title: "Are you sure?",
            text: "Once deleted it can't be recovered!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e32e36',
            cancelButtonColor: '#1b263b',
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"

        },
        deleteItemSuccess: {
            title: "Item deleted",
            text: "Item deleted successfully",
            icon: "success"
        },
        deleteItemError: {
            title: 'Error',
            text: "Error deleting item",
            icon: "error"
        },
        sessionError: {
            title: 'Error',
            text: 'The session has expired',
            icon: "error"
        },
        accessDeniedError: {
            title: 'Error',
            text: 'Access denied to this storage room',
            icon: "error"
        },
        itemNotFoundError: {
            title: 'Error',
            text: 'Item not found',
            icon: "error"
        },
        networkError: {
            title: 'Error',
            text: 'Network error',
            icon: "error"
        },
        unexpectedError: {
            title: 'Error',
            text: 'Unexpected error, try it later',
            icon: "error"
        },
        passwordUpdated: {
            title: 'Contraseña actualizada',
            // text: 'Password updated',
            icon: "success"
        },
        storageRoomCreated: {
            title: "Trastero creado",
            icon: "success"
        },
        deleteStorageRoomConfirmation: {
            title: "Are you sure?",
            text: "Once deleted it can't be recovered!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e32e36',
            cancelButtonColor: '#1b263b',
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"

        },
        deleteStorageRoomNoPermission: {
            title: 'Error',
            text: 'Only the admin of the storage room can access to settings',
            icon: "error"
        },
        readOnlyPermission: {
            title: 'Error',
            text: 'You only have reading permission',
            icon: "error"
        },
        deleteStorageRoomDeletionSuccess: {
            title: 'Storage room succesfully deleted',
            // text: 'Only the admin of the storage room can access to settings',
            icon: "success"
        },
        emailVerifiedSuccess: {
            title: 'Email verified',
            text: 'Now you can log in',
            icon: "success"
        },
        UserNotFoundException: {
            title: 'Email not found',
            icon: "error"
        }
    } 

};

export const getDeleteStorageRoomConfirmationMsg = (locale, numItems) => {
    let msg = {
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e32e36',
        cancelButtonColor: '#1b263b',
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel"
    };
    if (locale === 'en') {
        msg.title = "Are you really sure?";
        msg.text = `${numItems} item${numItems > 1 ? 's' : ''} will be completly deleted`
    } else if (locale === 'es') {
        msg.title = "¿Estás completamente seguro?";
        msg.text = `${numItems} elemento${numItems > 1 ? 's' : ''} serán completamente eliminados`
    }
    return msg
}
