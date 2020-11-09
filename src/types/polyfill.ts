type DataRow = [string, string, string, string, string, number]
type DataChunk = {
  key: string
  isError: boolean
  hash: string
  data: any
  sideChannel: any
}

interface Window {
  AF_initDataChunkQueue?: DataChunk[]
}
