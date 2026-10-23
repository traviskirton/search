import { Container, Title, Stack, Box, Group, ActionIcon, Text } from '@mantine/core'
import { SearchResult, DataLine } from './components/SearchResult'
import { Menu } from './components/Menu'
import { TypeIcon, entityTypes } from './components/TypeIcon'
import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { ChatPanel } from './components/ChatPanel'
import { tagToLabel } from './tag-taxonomy'

function Components() {
  return (
    <Container size="sm" py="xl">
      <Title mb="xl">Components</Title>

      <Stack gap="lg">
        <Box mb={180}>
          <Title order={3} mb="sm">Menu</Title>
          <Group>
            <Menu
              defaultOpened
              position="bottom-start"
              items={[
                { label: 'View details' },
                { label: 'Submenu', items: [
                  { label: 'Option A' },
                  { label: 'Option B' },
                ]},
                { divider: true },
                { label: 'Delete'},
              ]}
            >
               <ActionIcon variant="key" size="md"><DotsThreeVerticalIcon /></ActionIcon>
            </Menu>
          </Group>
        </Box>

        <Box>
          <Title order={3} mb="sm">Type Icons</Title>
          <Box p="md" bg="var(--sc-surface)" style={{ borderRadius: 12, boxShadow: 'var(--sc-card)' }}>
            <Group gap="lg">
              {entityTypes.map((type) => (
                <Group key={type} gap="xs">
                  <TypeIcon type={type} size={20} />
                  <Text fz="sm" c="var(--sc-muted)">{tagToLabel(type)}</Text>
                </Group>
              ))}
            </Group>
          </Box>
        </Box>

        <Box>
          <Title order={3} mb="sm">Search Result</Title>
          <Box>
            <Stack gap="sm">
              <SearchResult
                title="Al Pacino"
                description="An American actor renowned for his intense performances and portrayal of Michael Corleone in The Godfather trilogy."
                dataLine={
                  <DataLine
                    tags={['theater', 'film-star', 'academy-award-winner']}
                    links={[{ url: 'https://en.wikipedia.org/wiki/Al_Pacino', title: 'Wikipedia', type: 'wiki' }]}
                  />
                }
                type="Person"
              />
              <SearchResult
                title="The Godfather"
                description="A 1972 American crime film directed by Francis Ford Coppola, based on Mario Puzo's novel of the same name."
                dataLine={
                  <DataLine
                    tags={['crime', 'drama', 'mafia']}
                    links={[{ url: 'https://www.imdb.com/title/tt0068646/', title: 'IMDb', type: 'database' }]}
                  />
                }
                type="Movie"
              />
              <SearchResult
                title="221B Baker Street"
                description="The famous fictional London address of detective Sherlock Holmes."
                type="Location"
                updatedBy="Ana Ruiz"
                updatedAt="Oct 12"
              />
            </Stack>
          </Box>
        </Box>

        <Box>
          <Title order={3} mb="sm">Chat Panel</Title>
          <ChatPanel searchResults={[]} onSearchChange={() => {}} onFiltersChange={() => {}} />
        </Box>
      </Stack>
    </Container>
  )
}

export default Components
