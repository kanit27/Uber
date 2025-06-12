import React, { createContext, useState } from 'react'

export const CaptionDataContext = createContext()

const CaptionContext = ({children}) => {
  const [caption, setCaption] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  })

  return (
    <CaptionDataContext.Provider value={{caption, setCaption}}>
      {children}
    </CaptionDataContext.Provider>
  )
}

export default CaptionContext