export default new class Nyaa {
  base = 'https://nyaaapi.onrender.com/nyaa?q=1080'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    return this.search(titles[0], episode)
  }

  batch = this.single
  movie = this.single

  async search(title, episode) {

    function toKB(sizeStr) {
      if (!sizeStr) return 0
    
      const match = sizeStr.match(/([\d.]+)\s*(KiB|MiB|GiB|TiB|KB|MB|GB|TB)/i)
      if (!match) return 0
    
      const value = parseFloat(match[1])
      const unit = match[2].toUpperCase()
    
      const multipliers = {
        KB: 1,
        KIB: 1,
        MB: 1024,
        MIB: 1024,
        GB: 1024 * 1024,
        GIB: 1024 * 1024,
        TB: 1024 * 1024 * 1024,
        TIB: 1024 * 1024 * 1024
      }
    
      return Math.round(value * (multipliers[unit] || 0))
    }
    
    let query = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode) query += ` ${episode.toString().padStart(2, '0')}`

    const res = await fetch(this.base + encodeURIComponent(query))
    const json = await res.json()
    const list = json.data || []   // 👈 get only the array

    return list.map(item => ({
      title: item.title,
      link: item.magnet,
      hash: item.magnet?.match(/btih:([A-Fa-f0-9]+)/)?.[1] || '',
      seeders: Number(item.seeders || 0),
      leechers: Number(item.leechers || 0),
      downloads: Number(item.downloads || 0),
      size: 0,//toKB(item.size),
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
