import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { LeadRepository } from '../lib/repository'
import AnfrageFormular from './AnfrageFormular'

function repo(): LeadRepository {
  return {
    modus: 'demo',
    speichern: vi.fn().mockResolvedValue(undefined),
    analysieren: vi.fn().mockResolvedValue(undefined),
    liste: vi.fn().mockResolvedValue([]),
    statusSetzen: vi.fn().mockResolvedValue(undefined),
  }
}

describe('AnfrageFormular', () => {
  it('zeigt Fehler statt abzusenden, wenn Pflichtfelder fehlen', async () => {
    const r = repo()
    const onErfolg = vi.fn()
    render(
      <MemoryRouter>
        <AnfrageFormular repo={r} onErfolg={onErfolg} />
      </MemoryRouter>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Probetraining anfragen' }))
    expect(screen.getByText('Bitte gib deinen Namen an.')).toBeInTheDocument()
    expect(screen.getByText('Wähl mindestens ein Zeitfenster.')).toBeInTheDocument()
    expect(r.speichern).not.toHaveBeenCalled()
    expect(onErfolg).not.toHaveBeenCalled()
  })

  it('sendet eine ausgefüllte Anfrage ab', async () => {
    const r = repo()
    const onErfolg = vi.fn()
    render(
      <MemoryRouter>
        <AnfrageFormular repo={r} onErfolg={onErfolg} />
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText('Name'), 'Anna Beispiel')
    await userEvent.type(screen.getByLabelText('E-Mail'), 'anna@example.org')
    await userEvent.selectOptions(screen.getByLabelText('Was willst du erreichen?'), 'Muskelaufbau')
    await userEvent.click(screen.getByRole('checkbox', { name: 'Mo-Fr abends' }))
    await userEvent.click(screen.getByRole('checkbox', { name: /einverstanden/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Probetraining anfragen' }))
    expect(r.speichern).toHaveBeenCalledTimes(1)
    expect(onErfolg).toHaveBeenCalledWith({ gespeichert: true, analyse: 'fertig' })
  })
})
