import { useState } from 'react'

const useLoader = (value) => {
  const [loader, setLoader] = useState(value);

  return [loader, setLoader]
}

export default useLoader
