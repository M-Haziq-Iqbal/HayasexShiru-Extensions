export default new class Nyaa {
  base = 'https://nyaaapi.onrender.com/nyaa?q=1080'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    return this.search(titles[0], episode)
  }

  batch = this.single
  movie = this.single

  async search(title, episode) {
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
      size: Number(item.size),
      date: new Date(item.time),
      category: item.category,
      accuracy: 'high' ? 'high' : 'medium',
      type: 'alt'
    }))
  }

  async test() {
    const res = await fetch(this.base + 'one%20piece')
    return res.ok
  }
}()
