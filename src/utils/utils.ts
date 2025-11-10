export const addSeparatorNumber = (val: number, frequence: number, separator: string): string => {
  const tab = val.toString().split('').reverse()
  let valSeparated = ''
  let cpt = 0
  for (let i = 0; i < tab.length; i++) {
    if (cpt == frequence) {
      valSeparated += separator
      cpt = 0
    }
    valSeparated += tab[i]
    cpt++
  }
  return valSeparated.split('').reverse().join('')
}
