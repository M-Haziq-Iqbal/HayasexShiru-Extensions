export default new class Nyaa {
  base = 'https://nyaaapi.onrender.com/nyaa?q='

  async single({ titles, episode }) {
    if (!titles?.length) return []
    return this.search(titles[0], episode)
  }

  batch = this.single
  movie = this.single

  async search(title, episode) {

    function toBytes(sizeStr) {
      if (!sizeStr) return 0
    
      const match = sizeStr.match(/([\d.]+)\s*(KiB|MiB|GiB|TiB|KB|MB|GB|TB)/i)
      if (!match) return 0
    
      const value = parseFloat(match[1])
      const unit = match[2].toUpperCase()
    
      const multipliers = {
        KB: 1024,
        KIB: 1024,
    
        MB: 1024 ** 2,
        MIB: 1024 ** 2,
    
        GB: 1024 ** 3,
        GIB: 1024 ** 3,
    
        TB: 1024 ** 4,
        TIB: 1024 ** 4
      }
    
      return Math.round(value * (multipliers[unit] || 0))
    }
    
    let query = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode) query += ` ${episode.toString().padStart(2, '0')}`

    const res = await fetch(this.base + encodeURIComponent(query) + '%201080')
    const json = await res.json()
    const list = json.data || []   // 👈 get only the array

    return list.map(item => ({
      title: item.title,
      link: item.magnet,
      hash: item.magnet?.match(/btih:([A-Fa-f0-9]+)/)?.[1] || '',
      seeders: Number(item.seeders || 0),
      leechers: Number(item.leechers || 0),
      downloads: Number(item.downloads || 0),
      size: toBytes(item.size),
      date: new Date(item.time),
      accuracy: 'high'? 'high' : 'medium',
      type: 'alt'
    }))
  }

  async test() {
    const res = await fetch(this.base + 'one%20piece')
    return res.ok
  }
}()
