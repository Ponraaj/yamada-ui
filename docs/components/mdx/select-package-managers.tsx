import { Text, useBreakpoint } from '@yamada-ui/react'
import { Column, Table } from '@yamada-ui/table'
import { Component } from 'mdx/types'
import { useMemo, useState } from 'react'
import { PackageManagers } from './package-managers'
import { useConfigs } from 'contexts/configs-context'
import { useI18n } from 'contexts/i18n-context'

type Package = { name: string; description: string; isDefaultCheck?: boolean }

export type SelectPackageManagersProps = { packages: Package[] }

export const SelectPackageManagers: Component<SelectPackageManagersProps> = ({ packages }) => {
  const { colorScheme } = useConfigs()
  const breakpoint = useBreakpoint()
  const { t } = useI18n()
  const [selectedPackageNames, setSelectedPackageNames] = useState<string[]>(
    packages.filter(({ isDefaultCheck }) => isDefaultCheck).map(({ name }) => name),
  )

  const columns = useMemo<Column<Package>[]>(() => {
    const columns: Column<Package>[] = [
      {
        header: t('component.select-package-managers.name'),
        accessorKey: 'name',
        css: { w: '12.5rem' },
      },
    ]

    if (breakpoint !== 'sm') {
      columns.push({
        header: t('component.select-package-managers.description'),
        accessorKey: 'description',
        cell: ({ getValue }) => (
          <Text noOfLines={1}>
            {getValue<string>()
              .split(/`([^`]+)`/)
              .map((value, index) =>
                index % 2 === 1 ? (
                  <Text key={index} as='code' apply='mdx.code'>
                    {value}
                  </Text>
                ) : (
                  value
                ),
              )}
          </Text>
        ),
      })
    }

    return columns
  }, [t, breakpoint])

  return (
    <>
      <PackageManagers packageName={selectedPackageNames} />

      <Table
        mt='normal'
        colorScheme={colorScheme}
        columns={columns}
        data={packages}
        rowId='name'
        defaultSelectedRowIds={selectedPackageNames}
        onChangeSelect={setSelectedPackageNames}
        selectColumnProps={{
          css: {
            w: '2.5rem',
          },
        }}
        enableSorting={false}
        rowsClickSelect
        highlightOnHover
        highlightOnSelected={false}
      />
    </>
  )
}
