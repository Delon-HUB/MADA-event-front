import { EError } from '@/enums/EError'

export const errorForFrenchUser = (errorMessage: EError): string => {
  let message = "Une erreur inattendue s'est produite"
  switch (errorMessage) {
    case EError.USER_NOT_FOUND:
      message = 'Utilisateur introuvable'
      break
    case EError.WRONG_PASSWORD:
      message = 'Mot de passe incorrect'
      break
    case EError.EMAIL_ALREADY_EXISTS:
      message = 'Cet email est déjà utilisé'
      break
    case EError.INVALID_OTP:
      message = 'Code de vérification invalide'
      break
    case EError.OTP_EXPIRED:
      message = 'Le code de vérification a expiré'
      break
    case EError.INTERNAL_SERVER_ERROR:
      message = 'Erreur interne du serveur'
      break
    case EError.TOKEN_EXPIRED:
      message = 'Votre session a expiré. Veuillez vous reconnecter'
      break
    case EError.TOKEN_INVALID:
      message = 'Session invalide. Veuillez vous reconnecter'
      break
    case EError.INCOMPLETE_DATA:
      message = 'Données incomplètes. Veuillez vérifier tous les champs'
      break
    case EError.UNAUTHORIZED:
      message = 'Non autorisé. Veuillez vous connecter'
      break
    case EError.FORBIDDEN:
      message = "Accès refusé. Vous n'avez pas les permissions nécessaires"
      break
    case EError.BAD_REQUEST:
      message = 'Requête invalide. Veuillez vérifier vos données'
      break
    case EError.NOT_FOUND:
      message = 'Ressource introuvable'
      break
    case EError.ERR_NETWORK:
      message = 'Erreur de connexion au serveur\n. Vérifiez votre connexion internet'
      break
    default:
      message = "Une erreur inattendue s'est produite"
  }

  return message
}
